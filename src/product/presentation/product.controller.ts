import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { ProductResponseDto } from './dtos/product-response.dto.js';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../application/use-cases/create-product/create-product.command.js';

@Controller()
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<void> {
    await this.commandBus.execute(
      new CreateProductCommand(
        dto.name,
        dto.description,
        dto.sku,
        dto.price,
        dto.currency,
        dto.stock,
      ),
    );
  }
}
