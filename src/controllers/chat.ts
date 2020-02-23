import amqp from 'amqplib';
import { Request, Response, NextFunction } from 'express';

import { ChatMessage } from '../db/chat';
import { RABBITMQ_QUEUE, DEFAULT_CHANNEL } from '../util/envVariables';
import amqpChannel from '../util/rabbitMQ';

export const publishMessage = async (chatMessage: ChatMessage) => {
    const ch = await amqpChannel();
    ch.assertQueue(RABBITMQ_QUEUE, { durable: false, });
    const messageBuffer = Buffer.from(JSON.stringify(chatMessage));
    ch.sendToQueue(RABBITMQ_QUEUE, messageBuffer);
}

export const stockBotMiddleware = async (req: Request, res: Response, next:NextFunction) => {
    const {
        username,
        message,
    } = req.body;
    const channel = req.url.slice(1) || DEFAULT_CHANNEL;
    if (!message) {
        next();
        return;
    }
    const cmdRegex = /\/stock\s*=?\s*([^\s=]+)/;
    const cmdMatch = message.match(cmdRegex);
    if(!cmdMatch) {
        next();
        return;
    }
    const stockCode = cmdMatch[1];
    const ch = await amqpChannel();
    ch.assertQueue('stock_bot', { durable: false, });
    const botObject = {
        username,
        stockCode,
        channel,
    };
    const messageBuffer = Buffer.from(JSON.stringify(botObject));
    ch.sendToQueue('stock_bot', messageBuffer);
    next();
}