const { Schema, model } = require('mongoose');

const carSchema = Schema(
  {
    kms_on_odometer: { type: Number, required: true },
    major_scratches: { type: Number, required: true },
    original_paint: { type: String, required: true },
    no_of_accidents: { type: Number, required: true },
    no_of_previous_buyers: { type: Number, required: true },
    registration_place: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: [String], required: true },
    dealerID: { type: Schema.Types.ObjectId },
    status: {
      type: String,
      default: 'Available',
      enum: ['Sold Out', 'Available']
    },
    oem_specs: { type: Schema.Types.ObjectId, ref: 'OEM_Spec' }
  },
  {
    versionKey: false
  }
);

const Car = model('Marketplace_Inventory', carSchema, 'Marketplace_Inventory');

module.exports = { Car };
