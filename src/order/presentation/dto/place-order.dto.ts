import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class PlaceOrderItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  productName: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @IsOptional()
  currency: string = 'USD';

  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class PlaceOrderDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => PlaceOrderItemDto)
  items: PlaceOrderItemDto[];

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  shippingStreet: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  shippingCity: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  shippingState: string;

  @IsString()
  @MinLength(5)
  @MaxLength(10)
  shippingZipCode: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  shippingCountry: string;
}
