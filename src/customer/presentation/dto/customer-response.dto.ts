import { Customer } from '../../domain/entities/customer.entity.js';

export class CustomerResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id.getValue();
    dto.email = customer.email.getValue();
    dto.firstName = customer.firstName;
    dto.lastName = customer.lastName;
    dto.fullName = customer.fullName;
    dto.phoneNumber = customer.phoneNumber;
    dto.isActive = customer.isActive;
    dto.createdAt = customer.createdAt;
    dto.updatedAt = customer.updatedAt;
    return dto;
  }
}
