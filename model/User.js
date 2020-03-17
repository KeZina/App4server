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
    messages: [{
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true
        },
        date: {
            type: Number,
            required: true
        }
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

userSchema.methods.addFriend = async function(targetUser) {
    this.friends = [...this.friends, targetUser];
    await this.save();
}

userSchema.methods.removeFriend = async function(targetUser) {
    this.friends = this.friends.filter(friend => friend !== targetUser);
    await this.save();
}

userSchema.methods.haveSuchFriend = function(targetUser) {
    const isHaveSuchFriend = this.friends.filter(friend => friend === targetUser);
    if(isHaveSuchFriend.length !== 0) {
        return true;
    } else return false;
}

userSchema.methods.sortMessages = function(date = 'recent') {
    if(date === 'recent') {
        const messages = this.messages;
        messages.sort((a, b) => b.date - a.date);
        return messages;
    } else if(date === 'distant') {
        const messages = this.messages;
        messages.sort((a, b) => a.date - b.date);
        return messages;
    }
}

userSchema.methods.getPrettyMessages = function() {
    const sortedMessages = this.sortMessages();
    const date = sortedMessages.map(message => {
        return `${new Date(message.date).toLocaleTimeString()} ${new Date(message.date).toDateString()}`
    })
    return {
        sortedMessages,
        date
    }
}

userSchema.methods.getMessages = function() {
    const {sortedMessages, date} = this.getPrettyMessages();
    const messages = sortedMessages.map((message, index) => {
        let {_id, title, content, sender} = message;
        return {
            _id,
            title,
            content,
            sender,
            date: date[index]
        }
    })

    return messages;
}

userSchema.methods.addMessage = async function(message) {
    message.date = Date.now();
    this.messages = [...this.messages, message];
    await this.save();
}

userSchema.methods.changeTheme = async function(theme) {
    this.theme = theme;
    await this.save();
}

module.exports = model('User', userSchema)
