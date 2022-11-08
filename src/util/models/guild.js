const { Schema, model } = require('mongoose');

module.exports = model('guilds', new Schema({
    id: String,
    development: Boolean,
    bot_manager: String,
    prefix: { type: String, default: '-' },
    slashCommands: { type: Boolean, default: true },
    log: String,
    moderation: {
        enabled: Boolean, 
        id: String
    },
    levels: {
        enabled: Boolean,
        id: String
    },
    suggentios: {
        enabled: Boolean,
        id: String
    }
}))