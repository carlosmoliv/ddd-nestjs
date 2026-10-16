import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CustomerResponseDto, RegisterCustomerDto } from './dto/index.js';
import { RegisterCustomerCommand } from '../application/use-cases/register-product/register-customer.command.js';
import { ListCustomersQuery } from '../application/queries/list-customers.query.js';
import { Customer } from '../domain/entities/customer.entity.js';
import { GetCustomerQuery } from '../application/queries/get-customer.query.js';
import { DeleteCustomerCommand } from '../application/use-cases/delete-product/delete-customer.command.js';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Get()
  async list(): Promise<CustomerResponseDto[]> {
    const customers = await this.queryBus.execute<
      ListCustomersQuery,
      Customer[]
    >(new ListCustomersQuery());
    return customers.map(CustomerResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
      new GetCustomerQuery(id),
    );
    return CustomerResponseDto.fromDomain(customer);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<DeleteCustomerCommand, void>(
      new DeleteCustomerCommand(id),
    );
  }
}
