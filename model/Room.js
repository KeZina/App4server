const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    messages: [{
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
    }]
})

roomSchema.methods.sortMessages = function(date = 'recent') {
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

roomSchema.methods.getPrettyMessages = function() {
    const sortedMessages = this.sortMessages();
    const date = sortedMessages.map(message => {
        return `${new Date(message.date).toLocaleTimeString()} ${new Date(message.date).toDateString()}`
    })
    return {
        sortedMessages,
        date
    }
}

roomSchema.methods.getMessages = function() {
    const {sortedMessages, date} = this.getPrettyMessages();
    const messages = sortedMessages.map((message, index) => {
        let {_id, content, sender} = message;
        return {
            _id,
            content,
            sender,
            date: date[index]
        }
    })

    return messages;
}

roomSchema.methods.addMessage = async function(message) {
    this.messages = [...this.messages, message];
    await this.save();
}

module.exports = model('Room', roomSchema);