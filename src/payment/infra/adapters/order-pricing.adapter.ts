import { Inject, Injectable } from '@nestjs/common';
import {
  OrderPricing,
  OrderPricingPort,
  PricingLine,
} from '../../application/ports/order-pricing.port.js';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../../order/application/ports/order.repository.js';
import { OrderId } from '../../../order/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../order/domain/order-item.js';

@Injectable()
export class OrderPricingAdapter implements OrderPricingPort {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) {
      return null;
    }

    return {
      total: order.getTotal(),
      lines: order.items.map(this.toPricingLine),
    };
  }

  private toPricingLine(item: OrderItem): PricingLine {
    return {
      name: item.productName,
      quantity: item.quantity,
      unitAmount: item.getEffectiveUnitPrice(),
    };
  }
}
