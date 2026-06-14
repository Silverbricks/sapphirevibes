import { calculateOrderGst } from './gst.helper';

describe('calculateOrderGst', () => {
  it('extracts 10% GST from GST-inclusive price', () => {
    // $110 GST-inclusive → GST = $10
    const gst = calculateOrderGst(110);
    expect(gst).toBeCloseTo(10, 2);
  });

  it('returns 0 for zero amount', () => {
    expect(calculateOrderGst(0)).toBe(0);
  });

  it('handles decimal amounts correctly', () => {
    const gst = calculateOrderGst(55);
    expect(gst).toBeCloseTo(5, 2);
  });
});
