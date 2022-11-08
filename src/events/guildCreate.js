const guilds = require('../util/models/guild');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

module.exports = {
    name: 'guildCreate', 
    async execute (client, guild) {
        await (client.channels.resolve('1001093728674525194')).send(`New guild! Name: '${guild.name}', owner: '${guild.ownerId}`);
        const Guild = await guilds.findOne({id: guild.id});
        if(!Guild) new guilds({id: guild.id, prefix: '-', slashCommands: true}).save();

        commands = [];
        const slashCommandsFiles = fs.readdirSync('./src/commands/slash');
        for(folder of slashCommandsFiles){
            const commandsFolder = fs.readdirSync(`./src/commands/slash/${folder}`).filter(file => file.endsWith('.js'));
            for(file of commandsFolder){
                const command = require(`../commands/slash/${folder}/${file}`);
                commands.push(command.data.toJSON());
            }
        }
        
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        rest.put(Routes.applicationGuildCommands('992846881375916082', guild.id), {body: commands});
    }
} 