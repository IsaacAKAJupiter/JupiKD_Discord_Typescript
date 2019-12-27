import Command from '../../command';
import ytdl from 'ytdl-core';

module.exports = <Command>{
    name: 'play',
    aliases: [],
    category: 'info',
    description: 'Plays a song given a song name or URL.',
    nsfw: false,
    usage: '<song>',
    minArgs: 0,
    cooldown: 5,
    cooldownType: 'user',
    cooldownOwner: false,
    ownerCommand: false,
    runType: 'guildOnly',
    run: async (client, message, args) => {
        // Check if the user is in a voice channel.
        if (!message.member.voiceChannel) {
            await message.channel.send(
                `${message.author} You must be in a voice channel to use this command.`
            );
            return;
        }

        // Join the voice channel if not in a voice connection in the guild.
        if (!message.guild.voiceConnection) {
            if (message.member.voiceChannel.joinable) {
                await message.member.voiceChannel.join();
            } else {
                await message.channel.send(
                    `${message.author} I cannot join this voice channel.`
                );
                return;
            }
        }

        // Get the guild dispatcher and the queue.
        let dispatcher = client.dispatchers.get(message.guild.id);
        let queue = client.queues.get(message.guild.id);

        // client.dispatchers.set(message.guild.id, ytdl('', { filter: 'audioonly' }));
    }
};
