import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCustomerDto } from './dto/index.js';
import { RegisterCustomerCommand } from '../application/use-cases/register-product/register-customer.command.js';

@Controller('customers')
export class CustomerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async register(@Body() dto: RegisterCustomerDto): Promise<void> {
    await this.commandBus.execute<RegisterCustomerCommand, void>(
      new RegisterCustomerCommand(
        dto.email,
        dto.firstName,
        dto.lastName,
        dto.phoneNumber,
      ),
    );
  }
}
