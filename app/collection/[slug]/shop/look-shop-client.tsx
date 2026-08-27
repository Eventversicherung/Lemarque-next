"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { FullScreenSwiper } from "@/components/full-screen-swiper";
import type { Collection } from "@/lib/collections";
import { buildShopGroups } from "@/lib/shop-groups";

function ShopHeader({ collection }: { collection: Collection }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/70 via-black/25 to-transparent"
      />
      <div className="relative flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
        <BrandLogo size="sm" priority />
        <div className="flex items-center gap-6">
          <p className="hidden sm:block text-white/40 text-[10px] uppercase tracking-[0.2em]">
            Shopping {collection.name}
          </p>
          <Link
            href={`/collection/${collection.slug}`}
            className="text-white/60 hover:text-white transition-colors duration-300 text-xs uppercase tracking-[0.2em]"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LookShopClient({ collection }: { collection: Collection }) {
  const groups = buildShopGroups(collection);

  return (
    <FullScreenSwiper
      groups={groups}
      header={<ShopHeader collection={collection} />}
      emptyState={
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 px-6 text-center">
          <ShopHeader collection={collection} />
          <p className="text-white/60 text-xs uppercase tracking-[0.25em]">
            No shoppable looks yet for {collection.name}.
          </p>
          <Link
            href={`/collection/${collection.slug}`}
            className="text-white text-xs uppercase tracking-[0.2em] underline underline-offset-4"
          >
            Back to {collection.name}
          </Link>
        </div>
      }
    />
  );
}
