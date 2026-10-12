import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../application/customer.repository.js';
import { Customer } from '../domain/entities/customer.entity.js';
import { CustomerId } from '../domain/value-objects/customer-id.vo.js';
import { Email } from '../domain/value-objects/email.vo.js';
import {
  DRIZZLE_CLIENT,
  DrizzleDB,
} from '../../shared/infra/database/postgres/drizzle.provider.js';
import { customers } from '../../shared/infra/database/postgres/schema/index.js';
import { eq } from 'drizzle-orm';

type CustomerPersistence = typeof customers.$inferSelect;

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepository {
  constructor(@Inject(DRIZZLE_CLIENT) private readonly db: DrizzleDB) {}

  async save(customer: Customer): Promise<void> {
    const rawData = DrizzleCustomerRepository.toPersistence(customer);
    await this.db
      .insert(customers)
      .values(rawData)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          email: rawData.email,
          firstName: rawData.firstName,
          lastName: rawData.lastName,
          isActive: rawData.isActive,
          phoneNumber: rawData.phoneNumber,
          updatedAt: rawData.updatedAt,
        },
      });
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id.getValue()));

    return rows.length > 0 ? DrizzleCustomerRepository.toDomain(rows[0]) : null;
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const rows = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    return rows.length > 0 ? DrizzleCustomerRepository.toDomain(rows[0]) : null;
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.db.select().from(customers);
    return rows.map(DrizzleCustomerRepository.toDomain);
  }

  async delete(customer: Customer): Promise<void> {
    await this.db
      .delete(customers)
      .where(eq(customers.id, customer.id.getValue()));
  }

  private static toPersistence(customer: Customer): CustomerPersistence {
    return {
      id: customer.id.getValue(),
      email: customer.email.getValue(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      isActive: customer.isActive,
      phoneNumber: customer.phoneNumber,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private static toDomain(raw: CustomerPersistence): Customer {
    return Customer.reconstitute({
      id: new CustomerId(raw.id),
      email: Email.create(raw.email),
      firstName: raw.firstName,
      lastName: raw.lastName,
      isActive: raw.isActive,
      phoneNumber: raw.phoneNumber,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
