const { Schema, model } = require('mongoose');

const userSchema = Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    city: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    role: { type: String, enum: ['buyer', 'seller'] },
    cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
  },
  {
    versionKey: false
  }
);

const User = model('buyer', userSchema);

module.exports = { User };
