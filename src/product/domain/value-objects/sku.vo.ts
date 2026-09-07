export class Sku {
  private static readonly SKU_PATTERN = /^[A-Za-z0-9-]+$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 3;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Sku {
    const trimmed = value.trim();
    this.assertValid(trimmed);
    return new Sku(trimmed.toUpperCase());
  }

  private static assertValid(value: string): void {
    if (value.length < Sku.MIN_LENGTH || value.length > Sku.MAX_LENGTH) {
      throw new Error(
        `SKU must be between ${Sku.MIN_LENGTH} and ${Sku.MAX_LENGTH} characters long.`,
      );
    }
    if (!Sku.SKU_PATTERN.test(value)) {
      throw new Error(
        'SKU can only contain alphanumeric characters and hyphens.',
      );
    }
  }

  equals(other: Sku): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
