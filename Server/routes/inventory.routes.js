const { Router } = require('express');
const { auth } = require('../middlewares/auth.middleware');
const {
  getSpecs,
  createNewOEM,
  createNewUsedCar,
  getCarsForSellers,
  updateCar,
  deleteCar,
  boughtCar,
  getCarsForBuyers
} = require('../controllers/inventory.controllers');

// Setting up the express router
const inventoryRouter = Router();

// Setting up the authorization middleware
inventoryRouter.use(auth);

// Routes for Dealers started
inventoryRouter.get('/specs', getSpecs); // Done
inventoryRouter.post('/create/oem', createNewOEM); // Done
inventoryRouter.patch('/update/car/:carID', updateCar); // Done
inventoryRouter.post('/create/car', createNewUsedCar); // Done
inventoryRouter.get('/cars/:myCars?/:carID?', getCarsForSellers); // Done
inventoryRouter.delete('/delete/car/:carID', deleteCar); // Done
// Routes for Dealers ended

/* ------------------------------------------------- */

// Routes for Buyers started
inventoryRouter.get('/bought/:carID', boughtCar);
inventoryRouter.get('/:myCars?/:carID?', getCarsForBuyers);
// Routes for Buyers ended

module.exports = { inventoryRouter };
