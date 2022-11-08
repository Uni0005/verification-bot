const { EmbedBuilder, Formatters, Colors } = require('discord.js');
const { inspect } = require('util');
const guilds = require('../util/models/guild');

module.exports = {
    name: 'error', 
    async execute (client, error) {   
        console.log(error);

        const log = new EmbedBuilder()
            .setTitle('An error occurred with the event')
            .setFields([
                { name: 'Error', value: Formatters.codeBlock(inspect(error).substring(0, 1017)) }
            ])
            .setColor(Colors.Red);
        
        const development = await guilds.findOne({development: true});
        if(!development?.log) return;

        await (client.channels.resolve(development.log)).send({content: '<@920325546200694905>', embeds: [log]});
    }
}