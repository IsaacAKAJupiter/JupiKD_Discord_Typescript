import Command from '../../command';
import { CheckPermissions, GetMember } from '../../functions';

module.exports = <Command>{
    name: 'help',
    aliases: ['commands'],
    category: 'info',
    description:
        'Lists all of the commands or information about a specific command.',
    usage: '[command]',
    minArgs: 0,
    cooldown: 5,
    cooldownType: 'user',
    cooldownOwner: false,
    ownerCommand: false,
    runType: 'any',
    run: async (client, message, args) => {
        // Check if there are any arguments.
        if (!args.length) {
            // If there are no arguments, then we just need to send back all the commands.
            let commandsString = client.commands
                .filter(command =>
                    CheckPermissions(
                        message.guild ? message.member : message.author,
                        command,
                        client
                    )
                )
                .map(command => command.name)
                .join(', ');
            await message.channel.send(
                `My commands are: ${commandsString}.\nYou can send "${client.prefix}help [command]" to get information about a specific command.`,
                { split: true }
            );
            return;
        }

        // If there are arguments, check all the commands and their aliases.
        let command =
            client.commands.get(args[0]) ||
            client.commands.get(client.aliases.get(args[0]) || '');

        // If the command does not exist or the user does not have access to it.
        if (
            !command ||
            !CheckPermissions(
                message.guild ? message.member : message.author,
                command,
                client
            )
        ) {
            await message.channel.send(
                `${message.author} Command "${args[0]}" not found.`
            );
            return;
        }

        // If the command exists, give the user information about the command.
        let info = `**Name:** ${command.name}\n**Category:** ${command.category}`;
        if (command.aliases)
            info += `\n**Aliases:** ${command.aliases.join(', ')}`;
        if (command.description)
            info += `\n**Description:** ${command.description}`;
        if (command.usage)
            info += `\n**Usage:** ${client.prefix}${command.name} ${command.usage}`;
        info += `\n**Cooldown:** ${command.cooldown}s (type: ${command.cooldownType})`;
        info += `\n**Allowed to use** in ${
            command.runType === 'any'
                ? 'both DMs and guilds.'
                : command.runType === 'dmOnly'
                ? 'DMs.'
                : 'guilds.'
        }`;

        // Send the info.
        await message.channel.send(info, { split: true });
    }
};
