import { Test } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { ReferralsService } from '../referrals/referrals.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  cart: { findUnique: jest.fn(), update: jest.fn() },
  address: { findFirst: jest.fn() },
  user: { findUnique: jest.fn() },
  order: { create: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  orderStatusHistory: { create: jest.fn() },
  cartItem: { deleteMany: jest.fn() },
  $transaction: jest.fn(),
};
const mockInventory = { reserve: jest.fn(), getLowStock: jest.fn() };
const mockReferrals = { convertReferral: jest.fn() };

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: InventoryService, useValue: mockInventory },
        { provide: ReferralsService, useValue: mockReferrals },
      ],
    }).compile();
    service = module.get(OrdersService);
  });

  describe('createFromCart', () => {
    it('throws BadRequestException when cart is empty', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ items: [] });
      await expect(service.createFromCart('u1', 'addr1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when cart not found', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);
      await expect(service.createFromCart('u1', 'addr1')).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when shipping address not found', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({
        items: [{ variantId: 'v1', quantity: 1, unitPrice: 100, variant: { product: { name: 'P', gstRate: 10 }, name: 'V', sku: 'SKU' }, productId: 'p1' }],
        coupon: null, couponId: null, id: 'c1',
      });
      mockPrisma.address.findFirst.mockResolvedValue(null);
      await expect(service.createFromCart('u1', 'addr1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('applies status filter when provided', async () => {
      mockPrisma.order.count.mockResolvedValue(0);
      mockPrisma.order.findMany.mockResolvedValue([]);
      await service.findAll(1, 20, 'PENDING' as any);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { status: 'PENDING' } }));
    });
  });
});
