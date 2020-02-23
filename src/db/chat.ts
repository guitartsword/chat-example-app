import util from 'util';
import DataStore from "nedb";
import { DEFAULT_CHANNEL } from '../util/envVariables';

const db  = new DataStore('./db/chat');
db.loadDatabase();

export default db;
export interface ChatMessage {
    user: string
    message: string
    timestamp: number
    channel: string
    _id?: string
}

export const createMessage = async (user:string, message:string, channel=DEFAULT_CHANNEL) => {
    return new Promise<{error: Error | null, document: ChatMessage | null}>((res) => {
        db.insert({
            user,
            message,
            channel,
            timestamp: Date.now(),
        }, (err, doc) => {
            res({
                error: err,
                document: doc,
            });
        });
    });
}

export const getlastMessages = async (channel=DEFAULT_CHANNEL, messageCount=50) => {
    return new Promise<{error: Error | null, documents: ChatMessage[] | null}>((res) => {
        db.find({
            channel,
            user: {
                $exists: true
            }
        }).sort({
            timestamp: -1
        }).limit(messageCount).exec((err, doc) => {
            res({
                error: err,
                documents: doc,
            });
        });
    });
}