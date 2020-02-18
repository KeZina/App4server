const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    messages : [{
        content: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true
        }
    }]
})

roomSchema.methods.addMessage = async function(content, date, sender) {
    this.messages.push({
        content: content,
        date: date,
        sender: sender
    })

    await this.save();
}



module.exports = model('Room', roomSchema);