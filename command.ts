import Bot from './bot';
import discord from 'discord.js';

export default interface Command {
    name: string;
    aliases?: string[];
    category: string;
    description: string;
    usage: string;
    minArgs: number;
    cooldown: number;
    cooldownType: 'user' | 'guild' | 'global';
    cooldownOwner: boolean;
    runType: 'any' | 'guildOnly' | 'dmOnly';
    run: (client: Bot, message: discord.Message, args?: string[]) => any;
}
