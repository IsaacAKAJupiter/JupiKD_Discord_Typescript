import discord from 'discord.js';
import Bot from '../bot';

module.exports = async (client: Bot, message: discord.Message) => {
    // Set the prefix.
    const prefix = '.';

    // Ignore if statements.
    if (message.author.bot) return;
    if (!client.commands) return;

    let messageParsed;

    // Check if the message does not start with the prefix or the mention of the bot.
    if (!message.content.startsWith(prefix)) {
        // If not starting with prefix, check mention.
        messageParsed = message.content.replace(/^<@[^0-9]([0-9]+)>/, '$1');
        if (!messageParsed.startsWith(client.user.id)) return;
    }

    // Get the member if not cached.
    if (!message.member && message.guild) {
        message.member = await message.guild.fetchMember(message);
    }

    let args: string[];

    // Get the arguements and the command.
    if (!messageParsed) {
        args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
    } else {
        args = messageParsed
            .replace(/[0-9]+ ?/, '')
            .trim()
            .split(/ +/g);
    }

    let command = (<string>args.shift()).toLowerCase();

    // Grab the command data from the client.commands
    let cmd = client.commands.get(command);

    // If the command is not found, get a command from the aliases.
    if (!cmd && client.aliases) {
        cmd = client.commands.get(client.aliases.get(command) || '');
    }

    // If that command still does not exist, return.
    if (!cmd) return;

    // Check the runType.
    switch (cmd.runType) {
        case 'dmOnly':
            if (message.guild) return;
            break;
        case 'guildOnly':
            if (!message.guild) return;
            break;
    }

    // Check the minArgs.
    if (args.length < cmd.minArgs) {
        await message.channel.send(
            `${message.author} You did not send the correct amount of arguments. Sent: ${args.length}. Required: ${cmd.minArgs}.\n The proper usage for the command is "${prefix}${cmd.name} ${cmd.usage}".`
        );
        return;
    }

    // Check the cooldowns.
    let cooldown = client.cooldowns.get(cmd.name);

    // Check based on the type.
    switch (cmd.cooldownType) {
        case 'user':
            // Get the user.
            let user;
            if (cooldown) user = cooldown.get(`user:${message.author.id}`);

            // If on cooldown, let the user know for how long, if not, set the cooldown.
            if (
                cooldown &&
                (message.author.id !== client.owner || cmd.cooldownOwner) &&
                user &&
                user > Date.now()
            ) {
                let timeLeft = (user - Date.now()) / 1000;
                await message.channel.send(
                    `${
                        message.author
                    } The command is on cooldown for another ${timeLeft.toFixed(
                        2
                    )} seconds.`
                );
                return;
            } else {
                // If there is no cooldown, set cooldowns.
                if (!cooldown) {
                    client.cooldowns.set(cmd.name, new discord.Collection());
                    cooldown = client.cooldowns.get(cmd.name);
                }

                // Then set the guild cooldown.
                cooldown.set(
                    `user:${message.author.id}`,
                    Date.now() + cmd.cooldown * 1000
                );
            }
            break;
        case 'guild':
            // Get the guild.
            let guild;
            if (cooldown) guild = cooldown.get(`guild:${message.guild.id}`);

            // If on cooldown, let the user know for how long, if not, set the cooldown.
            if (
                cooldown &&
                (message.author.id !== client.owner || cmd.cooldownOwner) &&
                guild &&
                guild > Date.now()
            ) {
                let timeLeft = (guild - Date.now()) / 1000;
                await message.channel.send(
                    `${
                        message.author
                    } The command is on cooldown for another ${timeLeft.toFixed(
                        2
                    )} seconds.`
                );
                return;
            } else {
                // If there is no cooldown, set cooldowns.
                if (!cooldown) {
                    client.cooldowns.set(cmd.name, new discord.Collection());
                    cooldown = client.cooldowns.get(cmd.name);
                }

                // Then set the guild cooldown.
                cooldown.set(
                    `guild:${message.guild.id}`,
                    Date.now() + cmd.cooldown * 1000
                );
            }
            break;
        case 'global':
            // If on cooldown, let the user know for how long, if not, set the cooldown.
            if (
                cooldown &&
                (message.author.id !== client.owner || cmd.cooldownOwner) &&
                <number>cooldown > Date.now()
            ) {
                let timeLeft = (<number>cooldown - Date.now()) / 1000;
                await message.channel.send(
                    `${
                        message.author
                    } The command is on cooldown for another ${timeLeft.toFixed(
                        2
                    )} seconds.`
                );
                return;
            } else {
                client.cooldowns.set(
                    cmd.name,
                    Date.now() + cmd.cooldown * 1000
                );
            }
            break;
    }

    // Run the command
    cmd.run(client, message, args);
};
