const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    messages: [
        {
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
    ]
})

interface iMessage {
    content: string;
    sender: string;
    date: number;
}

interface iPrettyMessage {
    content: string;
    sender: string;
    date: string;
}

roomSchema.methods.sortMessages = function(date: 'recent' | 'distant' = 'recent'): Array<iMessage> {
    if(date === 'distant') {
        const messages: Array<iMessage> = this.messages.map((message: iMessage) => message);
        messages.sort((a: iMessage, b: iMessage) => a.date - b.date);
        return messages;
    } else {
        const messages: Array<iMessage> = this.messages.map((message: iMessage): iMessage => message);
        messages.sort((a: iMessage, b: iMessage) => b.date - a.date);
        return messages;
    }
}

roomSchema.methods.getMessages = function(): Array<iPrettyMessage> {
    const sortedMessages: Array<iMessage> = this.sortMessages();

    const messages: Array<iPrettyMessage> = sortedMessages.map((message: iMessage): iPrettyMessage => {
        const {content, sender, date} = message;
        return {
            content,
            sender,
            date: `${new Date(date).toLocaleTimeString()} ${new Date(date).toDateString()}`
        }
    })
    return messages;
}

roomSchema.methods.addMessage = async function(message: iMessage): Promise<void> {
    message.date = Date.now();
    this.messages = [...this.messages, message];
    await this.save();
}

export const Room: any = model('Room', roomSchema);