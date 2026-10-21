import { DomainException } from '../exceptions/domain.exception.js';

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency = 'USD'): Money {
    if (amount < 0) {
      throw new DomainException('Amount cannot be negative');
    }

    const normalizedValue = Math.round(amount * 100) / 100;
    const normalizedCurrency = currency.toUpperCase();
    return new Money(normalizedValue, normalizedCurrency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new DomainException('Multiplication factor cannot be negative');
    }
    const multipliedAmount = this.amount * factor;
    return Money.create(multipliedAmount, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this.amount - other.amount;
    if (result === 0) {
      throw new DomainException('Result of subtraction cannot be negative');
    }
    return Money.create(result, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount >= other.amount;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  toCents(): number {
    return Math.round(this.amount * 100);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainException(
        `Currency mismatch: ${this.currency} vs ${this.currency}`,
      );
    }
  }
}
