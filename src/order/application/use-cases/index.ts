import { PlaceOrderHandler } from './place-order/place-order.handler.js';
import { ConfirmOrderHandler } from './confirm-order/confirm-order.handler.js';

export const CommandHandlers = [PlaceOrderHandler, ConfirmOrderHandler];
