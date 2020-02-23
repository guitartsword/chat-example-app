import DataStore from 'nedb';
import { DEFAULT_CHANNEL } from '../util/envVariables';

const db = new DataStore('./db/chat');
db.loadDatabase();

export default db;
export interface ChatMessageSchema {
  user: string
  message: string
  timestamp: number
  channel: string
  _id?: string
}

export async function createMessage(user: string, message: string, channel = DEFAULT_CHANNEL) {
  return new Promise<{ error: Error | null, document: ChatMessageSchema | null }>((res) => {
    db.insert<ChatMessageSchema>({
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

export async function getlastMessages(channel = DEFAULT_CHANNEL, messageCount = 50) {
  return new Promise<{ error: Error | null, documents: ChatMessageSchema[] | null }>((res) => {
    db.find({
      channel,
      user: {
        $exists: true,
      },
    }).sort({
      timestamp: -1,
    }).limit(messageCount).exec((err, doc) => {
      res({
        error: err,
        documents: doc,
      });
    });
  });
}
