import { PrismaClient, ProductBadge, CollectionType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SapphireVibes database...');

  // ── Membership tiers ────────────────────────────────────────────────────
  const tiers = await Promise.all([
    prisma.membershipTier.upsert({
      where: { slug: 'free' },
      create: { name: 'Free', slug: 'free', minSpendAud: 0, discountPercentage: 0, rewardPointsMultiplier: 1.0, sortOrder: 0 },
      update: {},
    }),
    prisma.membershipTier.upsert({
      where: { slug: 'silver' },
      create: { name: 'Silver', slug: 'silver', minSpendAud: 200, discountPercentage: 5, rewardPointsMultiplier: 1.5, freeDeliveryThreshold: 100, birthdayGift: true, sortOrder: 1 },
      update: {},
    }),
    prisma.membershipTier.upsert({
      where: { slug: 'gold' },
      create: { name: 'Gold', slug: 'gold', minSpendAud: 500, discountPercentage: 10, rewardPointsMultiplier: 2.0, freeDeliveryThreshold: 0, birthdayGift: true, festivalGift: true, earlyAccess: true, sortOrder: 2 },
      update: {},
    }),
    prisma.membershipTier.upsert({
      where: { slug: 'vip' },
      create: { name: 'VIP', slug: 'vip', minSpendAud: 1000, discountPercentage: 15, rewardPointsMultiplier: 3.0, freeDeliveryThreshold: 0, birthdayGift: true, festivalGift: true, prioritySupport: true, earlyAccess: true, sortOrder: 3 },
      update: {},
    }),
  ]);
  console.log(`✓ ${tiers.length} membership tiers`);

  // ── Subscription plans ──────────────────────────────────────────────────
  const plans = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { slug: 'monthly' },
      create: { name: 'Monthly', slug: 'monthly', billingPeriod: 'MONTHLY', price: 14.99, stripePriceId: 'price_monthly_placeholder', discountPercentage: 10, freeDelivery: true, exclusiveAccess: true, earlyFestivalDeals: true, sortOrder: 0 },
      update: {},
    }),
    prisma.subscriptionPlan.upsert({
      where: { slug: 'yearly' },
      create: { name: 'Yearly', slug: 'yearly', billingPeriod: 'YEARLY', price: 129.99, stripePriceId: 'price_yearly_placeholder', discountPercentage: 20, freeDelivery: true, exclusiveAccess: true, earlyFestivalDeals: true, sortOrder: 1 },
      update: {},
    }),
  ]);
  console.log(`✓ ${plans.length} subscription plans`);

  // ── Categories ──────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Home Decor', slug: 'home-decor', sortOrder: 0 },
    { name: 'Wall Decor', slug: 'wall-decor', sortOrder: 1 },
    { name: 'Mirrors', slug: 'mirrors', sortOrder: 2 },
    { name: 'Statues & Figurines', slug: 'statues', sortOrder: 3 },
    { name: 'Planters & Artificial Plants', slug: 'planters', sortOrder: 4 },
    { name: 'Vases & Decorative Bowls', slug: 'vases', sortOrder: 5 },
    { name: 'Lighting & Lamps', slug: 'lighting', sortOrder: 6 },
    { name: 'Furniture Decor', slug: 'furniture-decor', sortOrder: 7 },
    { name: 'Home Accessories', slug: 'home-accessories', sortOrder: 8 },
    { name: 'Gift Items', slug: 'gifts', sortOrder: 9 },
    { name: 'Seasonal & Festival Collection', slug: 'festival-collection', sortOrder: 10 },
    { name: 'Trending Collections', slug: 'trending', sortOrder: 11 },
    { name: 'Sale', slug: 'sale', sortOrder: 12 },
    { name: 'Premium Luxury', slug: 'premium', sortOrder: 13 },
    { name: 'New Arrivals', slug: 'new-arrivals', sortOrder: 14 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: {},
    });
    categories[cat.slug] = c.id;
  }
  console.log(`✓ ${categoryData.length} categories`);

  // ── Sample products ─────────────────────────────────────────────────────
  const products = [
    { name: 'Abstract Brass Wall Art', slug: 'abstract-brass-wall-art', sku: 'SV-WA-001', categorySlug: 'wall-decor', basePrice: 242.00, badges: ['HOT', 'TRENDING'] as ProductBadge[], collectionTypes: ['HOT', 'TRENDING'] as CollectionType[] },
    { name: 'Framed Andalusian Mirror', slug: 'framed-andalusian-mirror', sku: 'SV-MR-001', categorySlug: 'mirrors', basePrice: 269.50, badges: ['NEW'] as ProductBadge[], collectionTypes: ['LATEST'] as CollectionType[] },
    { name: 'Dhana Gold Vase Large', slug: 'dhana-gold-vase-large', sku: 'SV-VA-001', categorySlug: 'vases', basePrice: 71.50, badges: ['TRENDING'] as ProductBadge[], collectionTypes: ['TRENDING'] as CollectionType[] },
    { name: 'Faux Monstera 70cm', slug: 'faux-monstera-70cm', sku: 'SV-PL-001', categorySlug: 'planters', basePrice: 71.50, badges: ['NEW'] as ProductBadge[], collectionTypes: ['LATEST'] as CollectionType[] },
    { name: 'Hills Gold Wall Shelf', slug: 'hills-gold-wall-shelf', sku: 'SV-WA-002', categorySlug: 'wall-decor', basePrice: 302.50, badges: ['HOT'] as ProductBadge[], collectionTypes: ['HOT'] as CollectionType[], isFeatured: true },
    { name: 'Brass Black Vase', slug: 'brass-black-vase', sku: 'SV-VA-002', categorySlug: 'vases', basePrice: 412.50, badges: ['NEW'] as ProductBadge[], collectionTypes: ['LATEST'] as CollectionType[], isFeatured: true },
    { name: 'Iona Resin Cheetah', slug: 'iona-resin-cheetah', sku: 'SV-ST-001', categorySlug: 'statues', basePrice: 181.50, badges: ['TRENDING'] as ProductBadge[], collectionTypes: ['TRENDING'] as CollectionType[], isFeatured: true },
    { name: 'Nube Metal Mirror', slug: 'nube-metal-mirror', sku: 'SV-MR-002', categorySlug: 'mirrors', basePrice: 242.00, badges: ['SALE'] as ProductBadge[], collectionTypes: ['TRENDING'] as CollectionType[], isFeatured: true },
    { name: 'Diwali Brass Diya Set', slug: 'diwali-brass-diya-set', sku: 'SV-DW-001', categorySlug: 'festival-collection', basePrice: 89.99, badges: ['FESTIVAL', 'HOT'] as ProductBadge[], collectionTypes: ['FESTIVAL_DEALS'] as CollectionType[], festivalType: 'diwali' },
    { name: 'Gold Lotus Centrepiece', slug: 'gold-lotus-centrepiece', sku: 'SV-DW-002', categorySlug: 'festival-collection', basePrice: 149.00, badges: ['FESTIVAL'] as ProductBadge[], collectionTypes: ['FESTIVAL_DEALS'] as CollectionType[], festivalType: 'diwali' },
    { name: 'Marble Effect Side Table', slug: 'marble-effect-side-table', sku: 'SV-FD-001', categorySlug: 'furniture-decor', basePrice: 329.00, badges: ['NEW'] as ProductBadge[], collectionTypes: ['LATEST'] as CollectionType[] },
    { name: 'Geometric Black Clock', slug: 'geometric-black-clock', sku: 'SV-HA-001', categorySlug: 'home-accessories', basePrice: 119.00, badges: ['TRENDING'] as ProductBadge[], collectionTypes: ['TRENDING'] as CollectionType[] },
    { name: 'Buddha Serenity Statue', slug: 'buddha-serenity-statue', sku: 'SV-ST-002', categorySlug: 'statues', basePrice: 199.00, badges: ['TRENDING'] as ProductBadge[], collectionTypes: ['TRENDING'] as CollectionType[] },
    { name: 'Ceramic Cloud Planter', slug: 'ceramic-cloud-planter', sku: 'SV-PL-002', categorySlug: 'planters', basePrice: 64.50, badges: ['NEW'] as ProductBadge[], collectionTypes: ['LATEST'] as CollectionType[] },
    { name: 'LED Moroccan Table Lamp', slug: 'led-moroccan-table-lamp', sku: 'SV-LT-001', categorySlug: 'lighting', basePrice: 189.00, badges: ['HOT'] as ProductBadge[], collectionTypes: ['HOT'] as CollectionType[] },
  ];

  let productCount = 0;
  for (const p of products) {
    const catId = categories[p.categorySlug];
    if (!catId) continue;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name, slug: p.slug, sku: p.sku,
        description: `${p.name} — premium quality Australian home décor. GST inclusive.`,
        categoryId: catId,
        basePrice: p.basePrice,
        gstRate: 10,
        badges: p.badges || [],
        collectionTypes: p.collectionTypes || [],
        festivalType: p.festivalType,
        isFeatured: (p as any).isFeatured || false,
        isActive: true,
        tags: [p.categorySlug, 'home-decor', 'australia'],
      },
      update: {},
    });

    // Create default variant + inventory
    const existingVariant = await prisma.productVariant.findFirst({ where: { productId: product.id, isDefault: true } });
    if (!existingVariant) {
      const variant = await prisma.productVariant.create({
        data: { productId: product.id, sku: `${p.sku}-DEFAULT`, name: 'Standard', isDefault: true, priceModifier: 0 },
      });
      await prisma.inventory.create({
        data: { variantId: variant.id, quantityOnHand: 50, quantityReserved: 0, lowStockThreshold: 5 },
      });
    }
    productCount++;
  }
  console.log(`✓ ${productCount} products with variants and inventory`);

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@sapphirevibes.com.au' } });
  if (!adminExists) {
    const freeTier = await prisma.membershipTier.findFirst({ where: { slug: 'free' } });
    const admin = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'SapphireVibes',
        email: 'admin@sapphirevibes.com.au',
        passwordHash: await bcrypt.hash('Admin@123!', 12),
        role: 'ADMIN',
        referralCode: 'ADMIN01',
        isEmailVerified: true,
      },
    });
    if (freeTier) {
      await prisma.membership.create({ data: { userId: admin.id, tierId: freeTier.id } });
    }
    console.log('✓ Admin user: admin@sapphirevibes.com.au / Admin@123!');
  }

  console.log('\n✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
