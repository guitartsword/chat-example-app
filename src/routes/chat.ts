import {Router} from 'express';
import { getlastMessages, createMessage } from '../db/chat';
import { verifyTokenMiddleware } from '../controllers/authentication';
import { publishMessage, stockBotMiddleware } from '../controllers/chat';

const router = Router();

router.use(verifyTokenMiddleware);
router.use(stockBotMiddleware);

router.post('/', async (req, res) => {
    const {username, message} = req.body;
    const {error, document} = await createMessage(username, message);
    if (error || !document) {
        res.send(error);
        return;
    }
    publishMessage(document);
    res.send(document);
});
router.post('/:channel', async (req, res) => {
    const {user, message, channel} = req.body;
    createMessage(user, message, channel);
    res.send({
        channel: req.params.channel,
        todo: true
    })
});

router.get('/', async (req, res) => {
    const {
        error,
        documents
    } = await getlastMessages();
    res.send({
        messages:  documents,
        error,
        messageCount: documents?.length
    });
});

export default router;