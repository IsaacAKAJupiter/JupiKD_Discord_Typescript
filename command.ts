import Bot from './bot';
import discord from 'discord.js';

export default interface Command {
    name: string;
    aliases?: string[];
    category: string;
    description: string;
    nsfw: boolean;
    usage: string;
    minArgs: number;
    cooldown: number;
    cooldownType: 'user' | 'guild' | 'global';
    cooldownOwner: boolean;
    permissions?: discord.PermissionString[];
    ownerCommand: boolean;
    runType: 'any' | 'guildOnly' | 'dmOnly';
    run: (client: Bot, message: discord.Message, args: string[]) => any;
}
