import {Router} from 'express';
import { create, getUser } from '../db/users';
import { handleLogin } from '../controllers/authentication';

const router = Router();

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    res.send(await handleLogin(username, password));
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