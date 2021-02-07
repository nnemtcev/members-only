const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, minlength: 1, maxlength: 80 },
    body: { type: String, required: true, minlength: 5, maxlength: 500 },
    author: { type: Schema.Types.ObjectId, required: true },
    timestamp: { type: String, required: true }
});

module.exports = mongoose.model('message', MessageSchema);