// Importing all the required stuff
const cors = require('cors');
const express = require('express');
const { PORT, connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
const { inventoryRouter } = require('./routes/inventory.routes');

const app = express();

// In-built middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome to the BuyCars Corp. API !!!</h1>');
});
app.use('/users', userRouter);
app.use('/inventory', inventoryRouter);

// Listening to the server
app.listen(PORT, connection);
