const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    messages: [{
        text: {
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

roomSchema.methods.getDate = () => {
    return `${new Date(this.messages.date).toLocaleTimeString()} ${new Date(this.messages.date).toDateString()}`
}

module.exports = model('Room', roomSchema);