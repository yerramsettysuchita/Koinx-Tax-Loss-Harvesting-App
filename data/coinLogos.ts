/**
 * CoinGecko small image URLs for each supported symbol.
 * Used by AssetLogo; falls back to colored letter circle on error.
 */
export interface CoinLogoInfo {
  id: number;
  url: string;
}

export const COIN_LOGOS: Record<string, CoinLogoInfo> = {
  BTC: { id: 1, url: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  ETH: { id: 279, url: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  SOL: { id: 4128, url: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  ADA: { id: 975, url: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  MATIC: { id: 4713, url: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
  DOT: { id: 12171, url: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
  DOGE: { id: 5, url: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  SHIB: { id: 11939, url: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  AVAX: { id: 12559, url: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  LINK: { id: 877, url: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  UNI: { id: 12504, url: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg' },
  XRP: { id: 44, url: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  USDT: { id: 325, url: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
};
