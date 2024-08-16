const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userId: {
        type: Schema.Types.String,
        required: true
    },
    message: {
        type: Schema.Types.String,
        required: false // This field is not required for bot responses
    },
    reply: {
        type: Schema.Types.String,
        required: false // This field is required for bot responses
    },
    timestamp: {
        type: Schema.Types.Date,
        default: Date.now,
        required: true
    },
   
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
