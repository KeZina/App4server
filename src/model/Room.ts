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

interface iMessages {
    content: string;
    sender: string;
    date: number;
}

interface iPrettyMessages {
    content: string;
    sender: string;
    date: string;
}

roomSchema.methods.sortMessages = function(date: 'recent' | 'distant' = 'recent'): Array<iMessages> {
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

roomSchema.methods.getMessages = function(targetUser: string): Array<iPrettyMessages> {
    const sortedMessages: Array<iMessages> = this.sortMessages();

    const messagesByTargetUser: Array<iMessages> = sortedMessages.filter((message: iMessages) => message.sender === targetUser);
    const messages: Array<iPrettyMessages> = messagesByTargetUser.map((message: iMessages): iPrettyMessages => {
        const {content, sender, date} = message;
        return {
            content,
            sender,
            date: `${new Date(date).toLocaleTimeString()} ${new Date(date).toDateString()}`
        }
    })
    return messages;
}

roomSchema.methods.addMessage = async function(message: iMessages): Promise<void> {
    message.date = Date.now();
    this.messages = [...this.messages, message];
    await this.save();
}

export const Room = model('Room', roomSchema);