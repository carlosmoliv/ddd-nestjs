export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency = 'USD'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    const normalizedValue = Math.round(amount * 100) / 100;
    const normalizedCurrency = currency.toUpperCase();
    return new Money(normalizedValue, normalizedCurrency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }
}
