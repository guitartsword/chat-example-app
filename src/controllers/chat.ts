import amqp from 'amqplib';
import { Request, Response, NextFunction } from 'express';

import { ChatMessage } from '../db/chat';
import { RABBITMQ_QUEUE } from '../util/envVariables';
import amqpChannel from '../util/rabbitMQ';

export const publishMessage = async (chatMessage: ChatMessage) => {
    const ch = await amqpChannel();
    ch.assertQueue(RABBITMQ_QUEUE, { durable: false, });
    const messageBuffer = Buffer.from(JSON.stringify(chatMessage));
    ch.sendToQueue(RABBITMQ_QUEUE, messageBuffer);
}

export const stockBotMiddleware = async (req: Request, res: Response, next:NextFunction) => {
    const message = req.body.message;
    if (!message) {
        next();
        return;
    }
    if(!message.includes('/stock=')) {
        next();
        return;
    }
    const stockCode = message.replace(/\/stock\s*=?\s*/, '');
    const ch = await amqpChannel();
    ch.assertQueue('stock_bot', { durable: false, });
    const messageBuffer = Buffer.from(stockCode);
    ch.sendToQueue('stock_bot', messageBuffer);
    next();
}