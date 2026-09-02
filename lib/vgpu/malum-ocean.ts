import { clock, effect, frameLoop, init, sampler, surface } from "vgpu";
import type { Effect, FrameLoopHandle, Gpu, Surface } from "vgpu";
import oceanShader from "./shaders/malum-ocean.wgsl";

export type MalumOceanHandle = {
  stop: () => void;
  setPaused: (paused: boolean) => void;
};

export type MalumOceanOptions = {
  reduced?: boolean;
  onReady?: () => void;
  onError?: (error: unknown) => void;
  onPulse?: (pulse: number) => void;
};

export const MALUM_PLATE_SRC = "/collections/malum/hero/malum-hero-night.png?v=13";

const WIND_ANGLE = 2.44;
const WIND_SPEED = 12;
const BOAT_UV: readonly [number, number] = [0.848, 0.181];
const BEAM_DIR: readonly [number, number] = [-0.53, 0.85];

const TEXTURE_USAGE = 0x02 | 0x04 | 0x10;

/** Slow searchlight breath (~7.4s). Keep in lockstep with the shader uniform. */
export function malumSearchlightPulse(time: number): number {
  const breath = 0.5 + 0.5 * Math.sin(time * 0.85 + 1.15);
  return 0.86 + breath * 0.34;
}

function isWebGpuAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

async function loadPlateTexture(gpu: Gpu, url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load MALUM plate (${response.status})`);
  }
  const bitmap = await createImageBitmap(await response.blob());
  const texture = gpu.gpu.createTexture({
    label: "malum-plate",
    size: [bitmap.width, bitmap.height],
    format: "rgba8unorm",
    usage: TEXTURE_USAGE,
  });
  gpu.gpu.queue.copyExternalImageToTexture(
    { source: bitmap },
    { texture },
    [bitmap.width, bitmap.height],
  );
  bitmap.close();
  return texture;
}

export function startMalumOcean(
  canvas: HTMLCanvasElement,
  options: MalumOceanOptions = {},
): MalumOceanHandle {
  const reduced = Boolean(options.reduced);
  const { onReady, onError, onPulse } = options;
  let disposed = false;
  let paused = false;
  let loop: FrameLoopHandle | undefined;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let ocean: Effect | undefined;
  let plate: ReturnType<Gpu["gpu"]["createTexture"]> | undefined;
  let unsubscribeResize: (() => void) | undefined;

  const params = {
    time: 0,
    windSpeed: WIND_SPEED,
    texel: [1 / 16, 1 / 9] as [number, number],
    boatUv: [...BOAT_UV] as [number, number],
    beamDir: [...BEAM_DIR] as [number, number],
    windAngle: WIND_ANGLE,
    quality: reduced ? 0.8 : 1,
    pulse: 1,
  };

  const startLoop = () => {
    if (disposed || paused || !gpu || !canvasSurface || !ocean || loop) return;
    const time = clock(gpu);
    let simTime = time.time;
    loop = frameLoop(
      gpu,
      (frame) => {
        if (paused || disposed || !canvasSurface || !ocean) return;
        simTime += Math.min(Math.max(time.deltaTime, 0), 1 / 45);
        const pulse = malumSearchlightPulse(simTime);
        ocean.set({
          params: {
            time: simTime,
            pulse,
          },
        });
        onPulse?.(pulse);
        frame.pass(canvasSurface, ocean);
      },
      { fps: reduced ? 30 : 0 },
    );
  };

  const stopLoop = () => {
    loop?.stop();
    loop = undefined;
  };

  void (async () => {
    try {
      if (!isWebGpuAvailable()) {
        throw new Error("WebGPU is not available");
      }

      gpu = await init({
        powerPreference: reduced ? "low-power" : "high-performance",
      });
      if (disposed) {
        gpu.dispose();
        return;
      }

      canvasSurface = surface(gpu, canvas, {
        dpr: reduced ? [1, 1.25] : [1, 1.5],
        alphaMode: "opaque",
      });
      params.texel = [
        canvasSurface.texelSize[0],
        canvasSurface.texelSize[1],
      ];

      plate = await loadPlateTexture(gpu, MALUM_PLATE_SRC);
      if (disposed) {
        plate.destroy();
        return;
      }

      ocean = effect(gpu, oceanShader, {
        label: "malum-ocean",
        set: {
          params,
          plate,
          samp: sampler(gpu, {
            minFilter: "linear",
            magFilter: "linear",
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge",
          }),
        },
      });
      if (disposed) return;

      unsubscribeResize = canvasSurface.onResize(() => {
        if (!ocean || !canvasSurface) return;
        ocean.set({
          params: {
            texel: [canvasSurface.texelSize[0], canvasSurface.texelSize[1]],
          },
        });
      });

      startLoop();
      onReady?.();
    } catch (error) {
      if (!disposed) onError?.(error);
    }
  })();

  return {
    stop() {
      disposed = true;
      stopLoop();
      unsubscribeResize?.();
      plate?.destroy();
      plate = undefined;
      gpu?.dispose();
      gpu = undefined;
      canvasSurface = undefined;
      ocean = undefined;
    },
    setPaused(next) {
      if (disposed || paused === next) return;
      paused = next;
      if (paused) stopLoop();
      else startLoop();
    },
  };
}

export { isWebGpuAvailable };
