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
        type: String,
    }
})

userSchema.methods.addToken = async function() {
    this.token = jwt.sign(
        {
            _id: this._id
        },
        config.get('jwtSecret'),
        {
            expiresIn: '12h'
        }
    )
    
    await this.save();
}

userSchema.methods.addHash = async function(password) {
    this.hash = await bcrypt.hash(password, 10);
}

userSchema.methods.compareHash = async function(password) {
    const hash = await bcrypt.compare(password, this.hash);
    return hash;
}


module.exports = model('User', userSchema);