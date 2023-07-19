const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');
const { secretKey1 } = require('../config/db');
const { Blacklist } = require('../models/blacklist.model');
const { Car } = require('../models/Marketplace_Inventory.model');

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || null;

    if (token) {
      let existingToken = await Blacklist.find({
        blacklist: { $in: token }
      });

      if (existingToken.length) {
        return res.status(400).send({
          error: 'Access denied!',
          description:
            'You are not logged in to perform this action. Please login again.'
        });
      }

      let decoded = jwt.verify(token, secretKey1);

      if (decoded) {
        if (decoded.role === 'seller') {
          console.log(req.params);
          if (req.params.carID) {
            let car = await Car.findById(req.params.carID);
            if (car.dealerID === decoded.userID) return next();

            return res.status(400).send({
              error: 'Access denied!',
              description: 'You are not allowed to perform this action.'
            });
          }
          req.body.dealerID = new Types.ObjectId(decoded.userID);
          return next();
        }

        if (req.method === 'GET') return next();

        return res.status(400).send({
          error: 'Access denied!',
          description: 'You are not allowed to perform this action.'
        });
      }

      return res.status(400).send({
        error: 'Access denied!',
        description: 'You are not allowed to perform this action.'
      });
    }

    return res.status(400).send({
      error: 'Access denied!',
      description:
        'You are not logged in to perform this action. Please login first.'
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports = { auth };
