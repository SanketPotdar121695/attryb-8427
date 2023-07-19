const { Schema, model } = require('mongoose');

const specsSchema = Schema(
  {
    model_name: { type: String, required: true },
    year: { type: Number, required: true },
    colors: { type: [String], required: true },
    list_price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    power: { type: Number, required: true },
    top_speed: { type: Number, required: true }
  },
  {
    versionKey: false
  }
);

const Specs = model('OEM_Spec', specsSchema);

module.exports = { Specs };
