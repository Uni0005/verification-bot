const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs')
const express = require('express');
const app = express();
const { checkOwnership } = require('./util/webutils');
require('dotenv').config();

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [Partials.Channel, Partials.Message, Partials.GuildMember], allowedMentions: {parse: ['users'], repliedUser: false}});
//Slash Commands
client.commands = new Collection();
const slashCommandsFiles = fs.readdirSync('./src/commands/slash');
for(folder of slashCommandsFiles){
    const commandsFolder = fs.readdirSync(`./src/commands/slash/${folder}`).filter(file => file.endsWith('.js'));
    for(file of commandsFolder){
        const command = require(`./commands/slash/${folder}/${file}`);
        client.commands.set(command.data.name, command)
    }
}

//Prefix Commands
client.prefixCommands = new Collection();

const prefixCommandsFiles = fs.readdirSync('./src/commands/prefix');
for(folder of prefixCommandsFiles){
    const commandsFolder = fs.readdirSync(`./src/commands/prefix/${folder}`).filter(file => file.endsWith('.js'));
    for(file of commandsFolder){
        const command = require(`./commands/prefix/${folder}/${file}`);
        client.prefixCommands.set(command.name, command);
    }
}

//Events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for(file of eventFiles){
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
}

client.login();

app.get('/', (req, res) => {
    res.send('use /verification')
})
  
app.get('/auth', async (req, res) => {
    auth1code = req.query.code
    state = req.query.state
    if(!auth1code || !state) return res.send('try to use /verification again')
    const data = state.trim().split(/ +/);
    console.log(state)
  
    const ownership = await checkOwnership(auth1code);
    if(ownership) {
        console.log('minecraft was found')
        const guild = await client.guilds.fetch(data[1])
        const member = await guild.members.fetch(data[0])
        // let pirate;
        // let verified;

        // if(state[1] == enserverid)
        member.roles.add('951536554856312874')
        member.roles.remove('952235601397161994')
        res.send('minecraft was found, you can close this page and check your roles')
    } else {
        const guild = await client.guilds.fetch(data[1])
        const member = await guild.members.fetch(data[0])
        member.roles.add('952235601397161994')
        member.roles.remove('951536554856312874')
        res.send('minecraft was not found, you can close this page')
    }
})
  
app.listen(80, () => {
    console.log(`Example app listening on port 80`)
})