import discord from 'discord.js';
import Command from './command';

export default class Bot extends discord.Client {
    public commands: discord.Collection<string, Command>;
    public aliases: discord.Collection<string, string>;
    public cooldowns: discord.Collection<string, any>;

    constructor(public owner: string, public prefix: string) {
        super();

        this.commands = new discord.Collection();
        this.aliases = new discord.Collection();
        this.cooldowns = new discord.Collection();
    }
}
