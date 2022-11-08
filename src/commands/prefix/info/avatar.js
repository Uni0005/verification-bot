const { Colors, EmbedBuilder, bold } = require('discord.js');
const { getUser } = require('../../../util/utils');
module.exports = {
    name: 'avatar',

    async execute(client, message, args) {
        let user = await getUser(client, message, args[0]);
        if(!user) user = message.author;
        message.reply({embeds: [new EmbedBuilder()
            .setDescription(`${bold(`Avatar for ${user.tag}`)}`)
            .setColor(Colors.Aqua)
            .setImage(user.displayAvatarURL({size: 2048, format: 'jpg', dynamic: true}))
        ]})
    }
}