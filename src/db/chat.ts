import util from 'util';
import DataStore from "nedb";

const db  = new DataStore('./db/chat');
db.loadDatabase();

export interface ChatMessage {
    message: string
    timestamp: number
    channel: string
    _id?: string
}

export const createMessage = async (user:string, message:string, channel='default') => {
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

export const getlastMessages = async (channel: string, messageCount=50) => {
    return new Promise<{error: Error | null, documents: ChatMessage[] | null}>((res) => {
        db.find({
            // channel
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