import { decode } from 'jsonwebtoken';
import { handleLogin } from '../controllers/authentication';

require('dotenv').config();

describe('Auth Function', () => {
  it.each([
    ['username', 'Password2', '$2b$15$kbIJYrK2wDow805opAx3F.gqtXEef16SD0vuZ3d0pVQ9cxclBkubi', { error: 'Invalid Password' }],
    ['username', 'ultraSecret', '$2b$15$OosP1GMzTXOJ21e3Q7SwSue9zhi/KIHo0rt5vP9BnqrsHASBruu8K', { error: 'Invalid Password' }],
    ['ivallei', 'theLastPassword', '$2b$15$OosP1GMzTXOJ21e3Q7SwSue9zhi/KIHo0rt5vP9BnqrsHASBruu8K', { error: 'Invalid Password' }],
  ])('returns error %s', async (username, pass, encrypted, expected) => {
    const result = await handleLogin(username, pass, encrypted);
    expect(result).toEqual(expected);
  });
  it.each([
    ['username', 'Password1', '$2b$05$L6yOfXSOv/8XbUnhK7aPCOHerHUIk1aCkvbSv0yRcKaJf4LITFkse'],
    ['username', 'Password1', '$2b$15$kbIJYrK2wDow805opAx3F.gqtXEef16SD0vuZ3d0pVQ9cxclBkubi'],
    ['ivalle', 'kbIJYrK2wDow805opAx3F', '$2b$12$6h/V/n71UE6aIo9LNsKhCOTZW05MWFyYsOxPq6Ryhg6nlYhLLwQJ.'],
    ['ivalle', 'kbIJYrK2wDow805opAx3F', '$2b$15$OosP1GMzTXOJ21e3Q7SwSue9zhi/KIHo0rt5vP9BnqrsHASBruu8K'],
  ])('return token %s', async (username, pass, encrypted) => {
    const result = await handleLogin(username, pass, encrypted);
    const payload = decode(result.token || '') as { username: string};
    expect(payload.username).toBeTruthy();
    expect(payload.username).toBe(username);
  });
});
