import DataStore from 'nedb';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../util/envVariables';

const db = new DataStore('./db/users');
db.loadDatabase();

interface UserSchema {
  username: string
  password: string
}
export function getUser(username: string) {
  return new Promise<{ error: Error | null, document: UserSchema | null }>((res) => {
    db.findOne({
      username,
    }, (err, doc) => {
      res({
        error: err,
        document: doc,
      });
    });
  });
}

export const create = async (username: string, password: string) => {
  if (password.length < 8 || username.length < 4) {
    return false;
  }
  const {
    error, document,
  } = await getUser(username);
  if (error) {
    return false;
  }
  if (document) {
    return false;
  }
  db.insert<UserSchema>({
    username,
    password: bcrypt.hashSync(password, SALT_ROUNDS),
  });
  return true;
};
