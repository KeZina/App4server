const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    hash: {
        type: String
    }
})

userSchema.methods.addToken = () => {
    this.token = jwt.sign(
        {
            _id
        },
        config.get('jwtSecret'),
        {
            expiresIn: '12h'
        }
    )
}

userSchema.methods.addHash = async password => {
    this.hash = await bcrypt.hash(password, 10);
}

userSchema.methods.compareHash = async password => {
    return await bcrypt.compare(password, this.hash);
}

module.exports = model('User', userSchema)
