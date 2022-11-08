const { Colors, EmbedBuilder, time } = require('discord.js');

module.exports = {
    name: 'status',

    async execute(client, message) {
        const onlineSice = Math.floor(client.readyTimestamp / 1000);
        const firstTimestamp = Date.now();
        const reply = await message.reply('one moment');
        const ping = Date.now() - firstTimestamp
        let color;

        if (ping >= 0 && ping < 250) color = Colors.Green;
        else if (ping < 500) color = Colors.Yellow;
        else color = Colors.Red;

        const embed = new EmbedBuilder()
            .setTitle('My status')
            .setFields(
                { name: 'My ping', value: `${ping} ms` }, 
                { name: 'Websocket ping', value: `${client.ws.ping} ms` },
                { name: 'Online since', value: `${time(onlineSice)} (${time(onlineSice, 'R')})`}
            )
            .setColor(color);

        reply.edit({embeds: [embed], content: ''});
    }
}