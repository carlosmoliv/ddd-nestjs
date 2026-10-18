import { AggregateRoot } from '@nestjs/cqrs';
import { Email } from '../value-objects/email.vo.js';
import { CustomerId } from '../value-objects/customer-id.vo.js';

interface CustomerProps {
  id: CustomerId;
  firstName: string;
  lastName: string;
  email: Email;
  isActive: boolean;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends AggregateRoot {
  private readonly _id: CustomerId;
  private _firstName: string;
  private _lastName: string;
  private _email: Email;
  private _isActive: boolean;
  private _phoneNumber: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    super();
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._isActive = props.isActive;
    this._phoneNumber = props.phoneNumber;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static register(
    email: Email,
    firstName: string,
    lastName: string,
    phoneNumber: string | null,
  ): Customer {
    const id = new CustomerId();
    const now = new Date();
    const props: CustomerProps = {
      id,
      firstName,
      lastName,
      email,
      isActive: true,
      phoneNumber,
      createdAt: now,
      updatedAt: now,
    };
    return new Customer(props);
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  get id(): CustomerId {
    return this._id;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): Email {
    return this._email;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
