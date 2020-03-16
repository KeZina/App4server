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
    theme: {
        type: String,
        default: 'boring-blue',
        required: true
    },
    dateOfRegistry: {
        type: Number,
        default: Date.now()
    },
    friends: [{
        type: String
    }],
    hash: {
        type: String
    }
})

userSchema.methods.addHash = async function(password) {
    this.hash = await bcrypt.hash(password, 10);
}

userSchema.methods.compareHash = async function(password) {
    return await bcrypt.compare(password, this.hash);
}

userSchema.methods.addToken = async function() {
    this.token = jwt.sign(
        {
            _id: this._id,
            auth: {
                temp: this.hash ? false : true,
                perm: this.hash ? true : false
            },
            name: this.name
        },
        config.get('jwtSecret'),
        {
            expiresIn: '12h'
        }
    );

    await this.save();
}

userSchema.methods.addFriend = async function(friend) {
    this.friends = [...this.friends, friend];
    await this.save();
}

userSchema.methods.changeTheme = async function(theme) {
    this.theme = theme;
    await this.save();
}

module.exports = model('User', userSchema)
