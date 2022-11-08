const { SlashCommandBuilder, Colors, EmbedBuilder, bold } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Send user's avatar")
        .addUserOption((option) => option.setName('user').setDescription('select a user')),
    run: async({client, interaction}) => {
        const user = interaction.options.getUser('user') || interaction.user;

        await interaction.deferReply();
        interaction.editReply({embeds: [new EmbedBuilder()
            .setDescription(`${bold(`Avatar for ${user.tag}`)}`)
            .setColor(Colors.Aqua)
            .setImage(user.displayAvatarURL({size: 2048, format: 'jpg', dynamic: true}))
        ]})
    }
}