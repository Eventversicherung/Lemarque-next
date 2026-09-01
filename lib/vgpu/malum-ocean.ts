import { clock, effect, frameLoop, init, surface } from "vgpu";
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
};

const LIGHT_POS: readonly [number, number, number] = [10.5, 22.0, -4.0];
const LIGHT_DIR: readonly [number, number, number] = [-0.32, -0.78, -0.54];
const WIND_ANGLE = 0.42;
const WIND_SPEED = 14;

function isWebGpuAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

export function startMalumOcean(
  canvas: HTMLCanvasElement,
  options: MalumOceanOptions = {},
): MalumOceanHandle {
  const reduced = Boolean(options.reduced);
  const { onReady, onError } = options;
  let disposed = false;
  let paused = false;
  let loop: FrameLoopHandle | undefined;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let ocean: Effect | undefined;
  let unsubscribeResize: (() => void) | undefined;

  const params = {
    time: 0,
    windSpeed: WIND_SPEED,
    texel: [1 / 16, 1 / 9] as [number, number],
    lightPos: [...LIGHT_POS] as [number, number, number],
    quality: reduced ? 0 : 1,
    lightDir: [...LIGHT_DIR] as [number, number, number],
    windAngle: WIND_ANGLE,
  };

  const startLoop = () => {
    if (disposed || paused || !gpu || !canvasSurface || !ocean || loop) return;
    const time = clock(gpu);
    loop = frameLoop(
      gpu,
      (frame) => {
        if (paused || disposed || !canvasSurface || !ocean) return;
        ocean.set({ params: { time: time.time } });
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
        dpr: reduced ? [1, 1.25] : [1, 1.75],
        alphaMode: "opaque",
      });
      params.texel = [
        canvasSurface.texelSize[0],
        canvasSurface.texelSize[1],
      ];

      ocean = effect(gpu, oceanShader, {
        label: "malum-ocean",
        set: { params },
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
