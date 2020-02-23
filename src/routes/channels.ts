import {Router} from 'express';

import chatdb from '../db/chat';

const router = Router();

router.get('/', async (req, res) => {
    chatdb.find({}).projection({
        channel: 1,
        _id: 0,
    }).exec((error, documents) => {
        // console.log(error, documents)
        const rawChannels = documents || [];
        const channels = new Set(rawChannels
            .map((doc) => doc.channel))
        res.send({
            error,
            channels: [...channels],
        });
    });
});

export default router;