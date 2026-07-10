const express = require('express');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');

const router = express.Router();

router.post('/add', createRestaurant);  // Create
router.get('/', getRestaurants);        // Read All
router.get('/:id', getRestaurantById);  // Read One
router.put('/:id', updateRestaurant);   // Update
router.delete('/:id', deleteRestaurant);// Delete

module.exports = router;
