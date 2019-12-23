import Command from '../../command';
import discord from 'discord.js';
import { GetMember, TotalSecondsToHMS } from '../../functions';
import dayjs from 'dayjs';

module.exports = <Command>{
    name: 'spotify',
    category: 'info',
    description:
        'Displays information about spotify playback for a member/user.',
    nsfw: false,
    usage: '[member]',
    minArgs: 0,
    cooldown: 5,
    cooldownType: 'user',
    cooldownOwner: false,
    ownerCommand: false,
    runType: 'any',
    run: async (client, message, args) => {
        // Define the variable for the user.
        let user: discord.User | undefined;

        // If sent as a DM or no arguments were sent, get the author.
        if (!message.guild || !args.length) {
            user = message.author;
        }

        // If user is not set, find the user.
        if (!user) {
            let member = GetMember(message, args.join(' '));

            user = member ? member.user : message.author;
        }

        // If still no user set, set it as the author.
        if (!user) user = message.author;

        // Check if the user is not listening to Spotify.
        if (
            !user.presence.game ||
            user.presence.game.type !== 2 ||
            user.presence.game.name !== 'Spotify'
        ) {
            await message.channel.send(
                `${message.author} ${user.username} is not listening to Spotify.`
            );
            return;
        }

        // Get the duration.
        let start = dayjs(user.presence.game.timestamps.start);
        let end = dayjs(user.presence.game.timestamps.end);
        let duration = TotalSecondsToHMS(end.diff(start, 'second'));

        // Create the embed.
        let embed = new discord.RichEmbed()
            .setColor('#ffa500')
            .setTitle(`Spotify Information for ${user.username}`)
            .setImage(user.presence.game.assets.largeImageURL)
            .addField('Song Name', user.presence.game.details)
            .addField('Artist', user.presence.game.state)
            .addField('Album', user.presence.game.assets.largeText)
            .addField('Duration', duration);

        // Send the embed.
        await message.channel.send(embed);
    }
};
