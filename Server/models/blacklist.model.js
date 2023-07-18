const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema(
  {
    blacklist: { type: [String], required: true }
  },
  { versionKey: false }
);

const Blacklist = mongoose.model('blacklist', blacklistSchema, 'blacklist');

module.exports = { Blacklist };
