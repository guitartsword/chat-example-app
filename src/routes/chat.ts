import { Router } from 'express';
import { getlastMessages, createMessage } from '../db/chat';
import { verifyTokenMiddleware } from '../controllers/authentication';
import { publishMessage, stockBotMiddleware } from '../controllers/chat';

const router = Router();

router.use(verifyTokenMiddleware);
router.use(stockBotMiddleware);

router.post('/', async (req, res) => {
  const { username, message } = req.body;
  const { error, document } = await createMessage(username, message);
  if (error || !document) {
    res.send(error);
    return;
  }
  publishMessage(document);
  res.send(document);
});
router.post('/:channel', async (req, res) => {
  const { username, message } = req.body;
  const { channel } = req.params;
  const { error, document } = await createMessage(username, message, channel);
  if (error || !document) {
    res.send(error);
    return;
  }
  publishMessage(document);
  res.send(document);
});

router.get('/', async (req, res) => {
  const {
    error,
    documents,
  } = await getlastMessages();
  res.send({
    messages: documents,
    error,
  });
});
router.get('/:channel', async (req, res) => {
  const { channel } = req.params;
  const {
    error,
    documents,
  } = await getlastMessages(channel);
  res.send({
    messages: documents,
    error,
  });
});


export default router;
