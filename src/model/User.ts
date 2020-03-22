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
        required: true
    },
    friends: [{
        type: String
    }],
    messages: [
        {
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
        }
    ],
    hash: {
        type: String
    }
})

interface iMessages {
    title: string;
    content: string;
    sender: string;
    date: number;
}

interface iPrettyMessages {
    title: string;
    content: string;
    date: string;
}

userSchema.methods.addHash = async function(password: string): Promise<void> {
    this.hash = await bcrypt.hash(password, 10);
}

userSchema.methods.compareHash = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.hash);
}

userSchema.methods.addToken = async function(): Promise<void> {
    this.dateOfRegistry = Date.now();
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

userSchema.methods.addFriend = async function(targetUser: string): Promise<void> {
    this.friends = [...this.friends, targetUser];
    await this.save();
}

userSchema.methods.removeFriend = async function(targetUser: string): Promise<void> {
    this.friends = this.friends.filter((friend: string) => friend !== targetUser);
    await this.save();
}

userSchema.methods.haveSuchFriend = function(targetUser: string): boolean {
    const isHaveSuchFriend: Array<string> = this.friends.filter((friend: string) => friend === targetUser);
    if(isHaveSuchFriend.length !== 0) {
        return true;
    } else return false;
}

userSchema.methods.sortMessages = function(date: 'recent' | 'distant' = 'recent'): Array<iMessages> {
    if(date === 'distant') {
        const messages: Array<iMessages> = this.messages.map((message: iMessages) => message);
        messages.sort((a: iMessages, b: iMessages) => a.date - b.date);
        return messages;
    } else {
        const messages: Array<iMessages> = this.messages.map((message: iMessages): iMessages => message);
        messages.sort((a: iMessages, b: iMessages) => b.date - a.date);
        return messages;
    }
}

userSchema.methods.getSenders = function(): Array<iMessages['sender']> {
    const arr: Array<iMessages['sender']> = this.messages.map((message: iMessages) : iMessages['sender'] => message.sender);
    const senders: Array<iMessages['sender']> = Array.from(new Set(arr));

    return senders;
}

userSchema.methods.getMessages = function(targetUser: string): Array<iPrettyMessages> {
    const sortedMessages: Array<iMessages> = this.sortMessages();

    const messagesByTargetUser: Array<iMessages> = sortedMessages.filter((message: iMessages) => message.sender === targetUser);
    const messages: Array<iPrettyMessages> = messagesByTargetUser.map((message: iMessages): iPrettyMessages => {
        const {title, content, date} = message;
        return {
            title,
            content,
            date: `${new Date(date).toLocaleTimeString()} ${new Date(date).toDateString()}`
        }
    })
    return messages;
}

userSchema.methods.addMessage = async function(message: iMessages): Promise<void> {
    message.date = Date.now();
    this.messages = [...this.messages, message];
    await this.save();
}

userSchema.methods.changeTheme = async function(theme: string): Promise<void> {
    this.theme = theme;
    await this.save();
}

export const User = model('User', userSchema);
