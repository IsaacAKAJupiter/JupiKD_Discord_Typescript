import Bot from './bot';
import Command from './command';
import fs from 'fs';
import { config } from 'dotenv';

// Configure dotenv.
config();

let client = new Bot(<string>process.env.DISCORD_BOT_OWNER);

// Load all of the events.
fs.readdir(
    'dist/events/',
    (err: NodeJS.ErrnoException | null, files: string[]) => {
        // Return an error if there was an error reading.
        if (err) return console.error(err);

        // Loop through the files.
        for (let i = 0; i < files.length; i++) {
            // Check if the file ends with .js.
            if (!files[i].endsWith('.js')) continue;

            // Get the event via require.
            let event = require(`./events/${files[i]}`);
            client.on(files[i].split('.')[0], event.bind(null, client));
        }
    }
);

// Load all of the commands/aliases.
fs.readdir(
    'dist/commands/',
    (err: NodeJS.ErrnoException | null, directories: string[]) => {
        // Return an error if there was an error reading.
        if (err) return console.error(err);

        // From the directory, load all the commands within it.
        for (let i = 0; i < directories.length; i++) {
            // Load all of the commands within the directory.
            fs.readdir(
                `dist/commands/${directories[i]}/`,
                (err: NodeJS.ErrnoException | null, files: string[]) => {
                    for (let j = 0; j < files.length; j++) {
                        // Check if the file ends with .js.
                        if (!files[j].endsWith('.js')) continue;

                        // Get the command via require.
                        let command: Command = require(`./commands/${directories[i]}/${files[j]}`);

                        // Add the command to the commands collection on the bot.
                        client.commands.set(command.name, command);

                        // Add the aliases of the command.
                        if (command.aliases && Array.isArray(command.aliases)) {
                            for (let k = 0; k < command.aliases.length; k++) {
                                client.aliases.set(
                                    command.aliases[k],
                                    command.name
                                );
                            }
                        }
                    }
                }
            );
        }
    }
);

client.login(process.env.DISCORD_TOKEN);
