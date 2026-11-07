import { OrderConfirmedHandler } from './order-confirmed.handler.js';
import { OrderPlacedHandler } from './order-placed.handler.js';

export const EventHandlers = [OrderPlacedHandler, OrderConfirmedHandler];
