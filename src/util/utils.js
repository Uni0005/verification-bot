const { ButtonStyle } = require('discord.js');

class utils {
    static async getUser(client, message, id){
        let user;
        if(message.content.startsWith(client.user)) user = message.mentions.users.at(1)
        else if(id) user = await client.users.fetch(id).catch(() => null)
        else user = message.mentions.users.first();

        return user;
    };

    static async getMember(client, message, id){
        let member;
        if(message.content.startsWith(client.user)) member = message.mentions.members.at(1)
        else if(id) member = await client.guild.members.fetch(id).catch(() => null)
        else member = message.mentions.members.first();

        return member;
    };
}

module.exports = utils