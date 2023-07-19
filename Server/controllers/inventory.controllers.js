const { User } = require('../models/User.model');
const { Specs } = require('../models/OEM_Specs.model');
const { Car } = require('../models/Marketplace_Inventory.model');

const getSpecs = async (req, res) => {
  const { q } = req.query;
  const filter = {};

  if (q) {
    if (isNaN(q)) filter.model_name = new RegExp(q, 'i');
    else filter.year = q;
  }

  try {
    const oem_specs = await Specs.find(filter);
    return res.status(200).send({ oem_specs });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const getCarsForSellers = async (req, res) => {
  const { myCars, carID } = req.params;
  const { _page, _limit } = req.query;

  let filter = {};

  let routes = req.url.split(/[?/=]/);

  for (let i = 0; i < routes.length; i++) {
    if (routes[i] === '_page') break;
    if (routes[i] === 'myCars')
      filter = { dealerID: req.body.dealerID.toString() };
    else if (routes[i].length && carID === undefined && routes[i] !== 'cars')
      filter = { _id: routes[i] };
  }

  filter = carID ? { ...filter, _id: carID } : filter;
  console.log(filter);

  const limit = Number(_limit) || 10;
  const page = Number(_page) || 1;
  const skip = (page - 1) * limit;

  let Cars = [];

  try {
    if (_page)
      Cars = await Car.find(filter)
        .populate('oem_specs')
        .skip(skip)
        .limit(limit);
    else Cars = await Car.find(filter).populate('oem_specs');

    return res.status(200).json(Cars);
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const createNewUsedCar = async (req, res) => {
  try {
    const dealer = await User.findById(req.body.dealerID).populate('cars');
    const car = new Car({ ...req.body });
    await car.save();

    dealer.cars.push(car);
    await dealer.save();

    return res.status(200).send({
      message: 'New car has been added for selling.',
      car_details: car
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const createNewOEM = async (req, res) => {
  try {
    let existingOEM = await Specs.find({ model_name: req.body.model_name });

    if (existingOEM.length) {
      return res.status(400).send({
        error: 'Access denied!',
        description: 'An OEM already exists with the same model name.'
      });
    }
    let oem = new Specs(req.body);
    await oem.save();

    return res
      .status(200)
      .send({ message: 'New OEM Specs have been added successfully.' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const updateCar = async (req, res) => {
  const updates = req.body;
  const carID = req.params.carID;

  try {
    await Car.findByIdAndUpdate(carID, updates);
    return res.status(200).send({
      message: `The car with ID: ${carID} has been updated successfully.`
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const deleteCar = async (req, res) => {
  const carID = req.params.carID;

  try {
    const dealer = await User.findById(req.body.dealerID);
    const carIndex = dealer.cars.indexOf(req.params.carID);

    if (carIndex === -1) {
      return res.status(400).send({ error: 'Car not found in the inventory.' });
    }

    dealer.cars.splice(carIndex, 1);
    await dealer.save();

    await Car.findByIdAndDelete(req.params.carID);
    return res.status(200).send({
      message: `The car with ID: ${carID} has been deleted successfully.`
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const getCarsForBuyers = async (req, res) => {
  let { myCars, carID } = req.params;
  let { q, title, _page, _limit, _sort, _order, colors } = req.query;

  let filters = myCars ? { userID: req.body.userID } : {};
  filters = carID ? { ...filters, carID } : filters;

  if (q) {
    filters.$or = [
      // { oem_specs: { model_name: new RegExp(q, 'i') } },
      { 'oem_specs.model_name': new RegExp(q, 'i') }
    ];
  }

  if (colors?.length) {
    filters.oem_specs.colors = { $all: colors };
  }

  if (title) {
    filters.title = { $in: category };
  }

  Object.keys(req.query).forEach((key) => {
    const value = parseInt(req.query[key]);
    const [field, operator] = key.split('_');

    if (operator === 'lte') {
      filters[field] = filters[field] || {};
      filters[field]['$lte'] = value;
    } else if (operator === 'gte') {
      filters[field] = filters[field] || {};
      filters[field]['$gte'] = value;
    }
  });

  const sort = {};

  if (_sort) {
    if (_order === 'asc') {
      sort[_sort] = 1;
    } else if (_order === 'desc') {
      sort[_sort] = -1;
    } else {
      sort[_sort] = 1;
    }
  }

  const limit = Number(_limit) || 10;
  const page = Number(_page) || 1;
  const skip = (page - 1) * limit;

  try {
    if (_page && _sort) {
      const cars = await Car.find()
        .populate('oem_specs')
        .find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return res.status(200).json(cars);
    } else if (_page) {
      const cars = await Car.find()
        .populate('oem_specs')
        .find(filters)
        .skip(skip)
        .limit(limit);
      return res.status(200).json(cars);
    } else if (_sort) {
      const cars = await Car.find()
        .populate('oem_specs')
        .find(filters)
        .sort(sort);
      return res.status(200).json(cars);
    } else {
      const cars = await Car.find().populate('oem_specs').find(filters);
      return res.status(200).json(cars);
    }
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const boughtCar = async (req, res) => {
  try {
    let { carID } = req.params;
    await Car.findByIdAndUpdate(carID, { status: 'Sold Out' });

    return res
      .status(200)
      .send({ message: 'Congratulations!!! You have made a great choice.' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports = {
  getSpecs,
  createNewOEM,
  createNewUsedCar,
  getCarsForSellers,
  updateCar,
  deleteCar,
  boughtCar,
  getCarsForBuyers
};
