export const PORT = process.env.PORT || 3000;
export const DEFAULT_CHANNEL = 'general';
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
export const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE || 'chat_app';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;