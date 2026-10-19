import { DomainException } from '../../shared/domain/exceptions/domain.exception.js';

export class ShippingAddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class ShippingAddress {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _zipCode: string;
  private readonly _country: string;

  private constructor(props: ShippingAddressProps) {
    this._street = props.street;
    this._city = props.street;
    this._state = props.street;
    this._zipCode = props.street;
    this._country = props.street;
  }

  static create(props: ShippingAddressProps): ShippingAddress {
    const street = props.street.trim();
    const city = props.city.trim();
    const state = props.state.trim();
    const zipCode = props.zipCode.trim();
    const country = props.country.trim().toUpperCase();

    if (!street) {
      throw new DomainException('Shipping address street is required.');
    }

    if (!city) {
      throw new DomainException('Shipping address city is required.');
    }

    if (!state) {
      throw new DomainException('Shipping address city is required.');
    }

    if (!zipCode) {
      throw new DomainException('Shipping address city is required.');
    }

    if (country.length !== 2) {
      throw new DomainException('Shipping address city is required.');
    }

    return new ShippingAddress({
      street,
      city,
      state,
      zipCode,
      country,
    });
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get country(): string {
    return this._country;
  }

  equals(other: ShippingAddress) {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    );
  }
}
