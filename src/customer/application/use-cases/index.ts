import { DeleteCustomerHandler } from './delete-product/delete-customer.handler.js';
import { RegisterCustomerHandler } from './register-product/register-product.handler.js';

export const CommandHandlers = [RegisterCustomerHandler, DeleteCustomerHandler];
