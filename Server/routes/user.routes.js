const { Router } = require('express');
const { passCheck } = require('../middlewares/pass_check.middleware');
const {
  signup,
  login,
  logout,
  regenerate
} = require('../controllers/user.controllers');

const userRouter = Router();

userRouter.post('/signup', passCheck, signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/relogin', regenerate);

module.exports = { userRouter };
