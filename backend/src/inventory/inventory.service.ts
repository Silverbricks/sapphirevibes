import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryChangeReason } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getByVariant(variantId: string) {
    const inv = await this.prisma.inventory.findUnique({ where: { variantId } });
    if (!inv) throw new NotFoundException('Inventory record not found');
    return { ...inv, quantityAvailable: inv.quantityOnHand - inv.quantityReserved };
  }

  async getLowStock(threshold = 5) {
    const records = await this.prisma.inventory.findMany({
      where: { quantityOnHand: { lte: threshold } },
      include: { variant: { include: { product: { select: { name: true, sku: true } } } } },
    });
    return records;
  }

  async adjust(variantId: string, quantity: number, reason: InventoryChangeReason, referenceId?: string, userId?: string) {
    const inv = await this.getByVariant(variantId);
    const newQty = inv.quantityOnHand + quantity;

    const [updated] = await this.prisma.$transaction([
      this.prisma.inventory.update({
        where: { variantId },
        data: { quantityOnHand: newQty },
      }),
      this.prisma.inventoryLog.create({
        data: {
          inventoryId: inv.id,
          changeQuantity: quantity,
          reason,
          referenceId,
          createdByUserId: userId,
        },
      }),
    ]);

    // Auto-disable product if stock reaches zero
    if (newQty <= 0) {
      const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
      if (variant) {
        const allVariants = await this.prisma.productVariant.findMany({
          where: { productId: variant.productId },
          include: { inventory: true },
        });
        const anyInStock = allVariants.some(
          (v) => v.inventory && v.inventory.quantityOnHand - v.inventory.quantityReserved > 0,
        );
        if (!anyInStock) {
          await this.prisma.product.update({ where: { id: variant.productId }, data: { isActive: false } });
        }
      }
    }

    return updated;
  }

  async reserve(variantId: string, quantity: number, orderId: string) {
    return this.prisma.inventory.update({
      where: { variantId },
      data: { quantityReserved: { increment: quantity } },
    });
  }

  async release(variantId: string, quantity: number, orderId: string) {
    return this.prisma.inventory.update({
      where: { variantId },
      data: { quantityReserved: { decrement: quantity } },
    });
  }

  async deduct(variantId: string, quantity: number, orderId: string, userId?: string) {
    return this.adjust(variantId, -quantity, InventoryChangeReason.SALE, orderId, userId);
  }
}
