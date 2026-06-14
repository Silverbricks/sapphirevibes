import { NextRequest, NextResponse } from 'next/server';

const COUPONS: Record<string, { discount: number; type: 'percent' | 'fixed'; label: string }> = {
  WELCOME10:  { discount: 0.10, type: 'percent', label: '10% off your first order' },
  SAPPHIRE15: { discount: 0.15, type: 'percent', label: '15% off — members only' },
  FREESHIP:   { discount: 0,    type: 'fixed',   label: 'Free shipping' },
};

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json() as { code: string; subtotal: number };
  const coupon = COUPONS[code?.toUpperCase()?.trim()];

  if (!coupon) {
    return NextResponse.json({ valid: false, message: 'Invalid or expired coupon code' }, { status: 400 });
  }

  const discountAmount = coupon.type === 'percent' ? subtotal * coupon.discount : coupon.discount;

  return NextResponse.json({ valid: true, discount: discountAmount, label: coupon.label });
}
