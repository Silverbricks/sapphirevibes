const GST_RATE = 0.10;

export function addGst(priceExGst: number): number {
  return Math.round(priceExGst * (1 + GST_RATE) * 100) / 100;
}

export function extractGst(priceIncGst: number): number {
  return Math.round((priceIncGst * GST_RATE) / (1 + GST_RATE) * 100) / 100;
}

export function calculateOrderGst(subtotalIncGst: number): number {
  return extractGst(subtotalIncGst);
}
