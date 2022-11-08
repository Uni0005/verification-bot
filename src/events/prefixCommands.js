const { EmbedBuilder, inlineCode, codeBlock, Colors } = require('discord.js');
const { inspect } = require('util');
const guilds = require('../util/models/guild');

module.exports = {
    name: 'messageCreate', 
    async execute (client, message) {
        if(message.system || message.author.bot || !message.guild) return;
        const guild = await guilds.findOne({id: message.guild.id});
        const devguild = await guilds.findOne({development: true});

        if(!message.content.startsWith(guild.prefix) && !message.content.startsWith(client.user)) return;
        let prefix = guild.prefix.length;
        if(message.content.startsWith(client.user)) prefix = 21;
        const args = message.content.slice(prefix).trim().split(/ +/);
        const commadname = args.shift().toLowerCase();
        if(!client.prefixCommands.has(commadname)) return;
        const command = client.prefixCommands.get(commadname);

        try {
            if(command.dev && !guild.development) return;
            if(command.permission && message.member.permissions.has(`${command.permission}`)) return message.reply({embeds: [
                new EmbedBuilder().setDescription(`:warning: You dont have permission to use this command! You need ${inlineCode(command.permission)} for using this command`)
            ]})
            command.execute(client, message, args);
        } catch (error) {
            console.log(error);

            const log = new EmbedBuilder()
                .setTitle('An error occurred with the slash command')
                .setFields([
                    { name: 'Command name', value: command.name },
                    { name: 'Error', value: codeBlock(inspect(error).substring(0, 1017)) }
                ])
                .setColor(Colors.Red);
            
            if(!devguild?.log) return;

            await (client.channels.resolve(devguild.log.id)).send({content: '<@920325546200694905>', embeds: [log]});
            await message.reply({content: 'There was a problem when executing this command'})
        }
    }
}