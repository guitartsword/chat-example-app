export const PORT = process.env.PORT || 80;
export const DEFAULT_CHANNEL = 'default';
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
export const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE || 'chat_app';
export const RABBITMQ_STOCKBOT_QUEUE = process.env.RABBITMQ_STOCKBOT_QUEUE || 'stock_bot';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
