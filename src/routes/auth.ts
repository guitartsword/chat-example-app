import { Router } from 'express';
import { create, getUser } from '../db/users';
import { handleLogin } from '../controllers/authentication';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { error, document } = await getUser(username);
  if (error || !document) {
    res.send({ error: 'User not found' });
    return;
  }
  res.send(await handleLogin(username, password, document.password));
});
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const created = await create(username, password);
  res.send({
    username,
    created,
  });
});

export default router;
