'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AssetLogoProps {
  /** Direct logo URL from the API */
  logoUrl: string;
  /** Coin symbol used for alt text and fallback letter */
  symbol: string;
  size?: number;
}

/**
 * Renders a coin logo from a direct URL.
 * Falls back to a colored letter circle when the image fails to load.
 */
export function AssetLogo({ logoUrl, symbol, size = 32 }: AssetLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <Image
        src={logoUrl}
        alt={symbol}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: '#64748B', fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {symbol.slice(0, 2)}
    </div>
  );
}
