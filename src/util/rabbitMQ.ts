import amqp from 'amqplib';
import { RABBITMQ_URL, RABBITMQ_QUEUE } from './envVariables';


let channel: amqp.Channel | undefined;

export default async () => {
    if( channel ) {
        return channel;
    }
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    ch.assertQueue(RABBITMQ_QUEUE, { durable: false, });
    channel = ch;
    return channel;
}