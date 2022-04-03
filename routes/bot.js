const express = require('express');
const router = express.Router();
const botsController = require('../controllers/botsController');
const { check } = require('express-validator');

// create a bot
// bots
router.post('/',
    [
        check('code', 'The code is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 })
    ],
    botsController.createBot
);

// get the list of all bots
// bots
router.get('/',
    botsController.getBots
);

// get one bot by id
// bots/id
router.get('/:id',
    botsController.getBotById
);

// patch an existing bot
// bots/id
router.patch('/:id',
    botsController.patchBot
);

// delete bot
// bots/id
router.delete('/:id',
    botsController.deleteBot
);

// assign delivery to a bot
// bots/assign/id
router.post('/assign/:id',
    [
        check('code', 'The code is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('delivery_code', 'The delivery code is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
    ],
    botsController.assignDeliveryToBot
);

module.exports = router;