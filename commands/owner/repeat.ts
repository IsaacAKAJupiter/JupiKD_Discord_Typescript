import Command from '../../command';
import discord from 'discord.js';

module.exports = <Command>{
    name: 'repeat',
    category: 'owner',
    description: 'Repeats a specific command a specific amount of times.',
    nsfw: false,
    usage: '<amount> <command> [command arguments]',
    minArgs: 2,
    cooldown: 5,
    cooldownType: 'user',
    cooldownOwner: true,
    ownerCommand: true,
    runType: 'any',
    run: async (client, message, args) => {
        // Get the amount of times to fire.
        let amount: number = parseInt(args[0]);

        // If the amount is NaN.
        if (Number.isNaN(amount)) {
            await message.channel.send(
                `${message.author} Amount of times given is not a number.`
            );
            return;
        }

        // Get the command.
        let command =
            client.commands.get(args[1]) ||
            client.commands.get(client.aliases.get(args[1]) || '');

        // If the command does not exist, let the user know and return.
        if (!command) {
            await message.channel.send(
                `${message.author} Command "${args[1]}" not found to repeat.`
            );
            return;
        }

        // Get the other arguments to send to the function.
        let commandArgs = args.slice(2);

        // Loop the amount of times and call the function.
        for (let i = 0; i < amount; i++) {
            await command.run(client, message, commandArgs);
        }
    }
};
