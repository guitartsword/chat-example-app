import { Request, Response, NextFunction } from 'express';

import { ChatMessageSchema } from '../db/chat';
import { RABBITMQ_QUEUE, DEFAULT_CHANNEL, RABBITMQ_STOCKBOT_QUEUE } from '../util/envVariables';
import amqpChannel from '../util/rabbitMQ';

export const publishMessage = async (chatMessage: ChatMessageSchema) => {
  const ch = await amqpChannel();
  ch.assertQueue(RABBITMQ_QUEUE, { durable: false });
  const messageBuffer = Buffer.from(JSON.stringify(chatMessage));
  ch.sendToQueue(RABBITMQ_QUEUE, messageBuffer);
};

export const getStockCode = (message: string) => {
  const cmdRegex = /\/stock\s*(=| )\s*([^\s=]+)/;
  const cmdMatch = message.match(cmdRegex);
  if (!cmdMatch) {
    return '';
  }
  return cmdMatch[2];
};

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
  const stockCode = getStockCode(message);
  if (!stockCode) {
    next();
    return;
  }
  const ch = await amqpChannel();
  ch.assertQueue(RABBITMQ_STOCKBOT_QUEUE, { durable: false });
  const botObject = {
    username,
    stockCode,
    channel,
  };
  const messageBuffer = Buffer.from(JSON.stringify(botObject));
  ch.sendToQueue(RABBITMQ_STOCKBOT_QUEUE, messageBuffer);
  next();
};
