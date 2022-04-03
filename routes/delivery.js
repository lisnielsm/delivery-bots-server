const express = require('express');
const router = express.Router();
const deliveriesController = require('../controllers/deliveriesController');
const { check } = require('express-validator');

// create a delivery
// deliveries
router.post('/',
    [
        check('code', 'The code is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('pickup.pickup_lat', 'The pickup latitude is required').isFloat(),
        check('pickup.pickup_lon', 'The pickup longitude is required').isFloat(),
        check('dropoff.dropoff_lat', 'The dropoff latitude is required').isFloat(),
        check('dropoff.dropoff_lon', 'The dropoff longitude is required').isFloat(),
        check('zone_id', 'The zone id is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
    ],
    deliveriesController.createDelivery
);

// get the list of all deliveries
// deliveries
router.get('/',
    deliveriesController.getDeliveries
);

// get one delivery by id
// deliveries/id
router.get('/:id',
    deliveriesController.getDeliveryById
);

// patch an existing delivery
// deliveries/id
router.patch('/:id',
    deliveriesController.patchDelivery
);

// delete delivery
// deliveries/id
router.delete('/:id', 
    deliveriesController.deleteDelivery
);

module.exports = router;