const { Schema, model } = require('mongoose');

const userSchema = Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    role: { type: String, enum: ['buyer', 'seller'] },
    cars: [{ type: Schema.Types.ObjectId, ref: 'Marketplace_Inventory' }]
  },
  {
    versionKey: false
  }
);

const User = model('user', userSchema);

module.exports = { User };
