const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, minlength: 1, maxlength: 20 },
    lastName: { type: String, required: true, minlength: 1, maxlength: 20 },
    email: { type: String, required: true, minlength: 1 },
    password: { type: String, required: true, minlength: 8 },
    membershipStatus: { type: String, required: true, enum: ['standard', 'member', 'admin'] }
});

UserSchema
.virtual('getFullName')
.get(function() {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('user', UserSchema);