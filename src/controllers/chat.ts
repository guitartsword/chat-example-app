import amqp from 'amqplib';

import { ChatMessage } from '../db/chat';
import { RABBITMQ_URL, RABBITMQ_QUEUE } from '../util/envVariables';

export const publishMessage = async (chatMessage: ChatMessage) => {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    ch.assertQueue(RABBITMQ_QUEUE, { durable: false, });
    const messageBuffer = Buffer.from(JSON.stringify(chatMessage));
    ch.sendToQueue(RABBITMQ_QUEUE, messageBuffer);
}
