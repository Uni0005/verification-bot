const { Colors, EmbedBuilder, inlineCode } = require('discord.js');
const guilds = require('../../../util/models/guild');

module.exports = {
    name: 'prefix',

    async execute(client, message, args) {
        const guild = await guilds.findOne({id: message.guild.id});
        if(!args[0] || !message.member.permissions.has('ManageMessages')) return message.reply(`My prefix is ${inlineCode(guild.prefix)}\n\nYou can also mention me instead of using a prefix or use my slash commands`);

        await guilds.updateOne({id: message.guild.id}, {$set: {prefix: args[0]}});
        message.reply(`My prefix has been changed to ${inlineCode(args[0])}`)
    }
}