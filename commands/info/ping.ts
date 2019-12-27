import Command from '../../command';
import discord from 'discord.js';

module.exports = <Command>{
    name: 'ping',
    aliases: ['latency', 'lag'],
    category: 'info',
    description: 'Displays the ping of the bot.',
    nsfw: false,
    usage: '',
    minArgs: 0,
    cooldown: 5,
    cooldownType: 'user',
    cooldownOwner: false,
    ownerCommand: false,
    runType: 'any',
    run: async (client, message, args) => {
        // Send the original message.
        let msg: discord.Message = <discord.Message>(
            await message.channel.send('Pinging...')
        );

        // Get the latency of it and also the latency of the discord API.
        let latency = Math.floor(
            msg.createdTimestamp - message.createdTimestamp
        );
        let latencyAPI = Math.round(client.ping);

        // Edit the original message.
        await msg.edit(
            `Pong!\nLatency is ${latency}ms.\nAPI Latency is ${latencyAPI}ms.`
        );
    }
};
