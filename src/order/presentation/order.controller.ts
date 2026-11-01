import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PlaceOrderDto } from './dto/place-order.dto.js';
import { PlaceOrderCommand } from '../application/use-cases/place-order/place-order.command.js';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async place(@Body() dto: PlaceOrderDto): Promise<void> {
    await this.commandBus.execute<PlaceOrderCommand, void>(
      new PlaceOrderCommand(
        dto.customerId,
        dto.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          currency: item.currency ?? 'USD',
          quantity: item.quantity,
        })),
        dto.shippingStreet,
        dto.shippingCity,
        dto.shippingState,
        dto.shippingZipCode,
        dto.shippingCountry,
      ),
    );
  }
}
