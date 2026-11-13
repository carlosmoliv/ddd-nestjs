import { DomainException } from '../../shared/domain/exceptions/domain.exception.js';

export enum PaymentStatusValue {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
}

export class PaymentStatus {
  private readonly value: PaymentStatusValue;

  constructor(value: PaymentStatusValue) {
    this.value = value;
  }

  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Pending);
  }

  static processing(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Processing);
  }

  static completed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Completed);
  }

  static fromString(value: string): PaymentStatus {
    const status = Object.values(PaymentStatusValue).find((v) => v === value);
    if (!status) {
      throw new DomainException(`Invalid payment status: ${value}`);
    }
    return new PaymentStatus(status);
  }

  getValue(): PaymentStatusValue {
    return this.value;
  }
}
