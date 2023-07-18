const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.model');
const { secretKey1, secretKey2 } = require('../config/db');
const { Blacklist } = require('../models/blacklist.model');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.find({ email });

    if (existingUser.length) {
      return res.status(400).send({
        error: 'Registration failed!',
        description:
          'A user already exists with the same email ID. Please try again with different email ID.'
      });
    }

    let hash = bcrypt.hashSync(password, 8);

    let user = new User({ ...req.body, password: hash, isAdmin: false });
    await user.save();

    return res.status(200).send({ message: 'Registration successful!' });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const newUser = req.body;
    const existingUser = (await User.findOne({ email: newUser.email })) || null;

    if (!existingUser) {
      return res.status(400).send({
        error: 'Login failed!',
        description: 'Wrong credentials provided. Please try again.'
      });
    }

    bcrypt.compare(newUser.password, existingUser.password, (error, result) => {
      if (result) {
        let token = jwt.sign(
          {
            userID: existingUser._id,
            role: existingUser.role,
            username: `${existingUser.firstname} ${existingUser.lastname}`
          },
          secretKey1,
          {
            expiresIn: '7d'
          }
        );

        let rToken = jwt.sign(
          {
            userID: existingUser._id,
            role: existingUser.role,
            username: `${existingUser.firstname} ${existingUser.lastname}`
          },
          secretKey2,
          {
            expiresIn: '28d'
          }
        );

        return res
          .status(200)
          .send({ message: 'Login successful!', token, rToken });
      }
      return res.status(400).send({
        error: 'Login failed!',
        description:
          'Wrong password provided. Please check your password and try again.'
      });
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || null;

    if (token) {
      await Blacklist.updateMany({}, { $push: { blacklist: token } });
      return res
        .status(200)
        .send({ message: 'You are logged out successfully!' });
    }

    return res.status(400).send({
      error: 'You are already logged out.',
      description: 'Please login again.'
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

const regenerate = async (req, res) => {
  try {
    let rToken = req.headers.authorization?.split(' ')[1] || null;
    let decoded = jwt.verify(rToken, secretKey2);

    if (decoded) {
      let token = jwt.sign(
        {
          userID: decoded.userID,
          role: decoded.role,
          username: decoded.username
        },
        secretKey1,
        {
          expiresIn: '7d'
        }
      );
      return res
        .status(200)
        .send({ message: 'Regeneration successful!', token, rToken });
    }
    return res.status(400).send({ error: 'Regeneration failed!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { signup, login, logout, regenerate };
