import discord from 'discord.js';
import Command from './command';
import Bot from './bot';

/**
 * This function checks if a member/user has permissions to use a command.
 *
 * @param member The member/user to check the permissions on.
 * @param command The command used/to check if the member/user has permisions to use.
 * @param client The Bot instance.
 * @returns A `boolean` indicating if the member/user has permission.
 */
export function CheckPermissions(
    member: discord.GuildMember | discord.User,
    command: Command,
    client: Bot
): boolean {
    // Check if the member is the owner.
    if (member.id === client.owner) return true;

    // Check if the command is an owner command and the user is an owner.
    if (command.ownerCommand) {
        return member.id === client.owner;
    }

    // Check if the command does not have permissions, and return true.
    if (!command.permissions) return true;

    // Check if the member is a user.
    if (member instanceof discord.User) {
        // Since there are no other permissions other than OWNER for DM conversations, return true.
        return true;
    }

    // If the member is a member, we need to check if the member has all the permissions of the command.
    return member.hasPermission(command.permissions);
}

/**
 * This functin
 *
 * @param message The command message used to fire this function.
 * @param search The string used to find a member.
 * @returns Either a `discord.GuildMember` instance or undefined if used incorrectly.
 */
export function GetMember(
    message: discord.Message,
    search: string
): discord.GuildMember | undefined {
    // If there is no guild in the message, return an error.
    if (!message.guild) {
        console.error('Attempting to use GetMember on a DM message.');
        return undefined;
    }

    // Check for the member in the guild by ID.
    let member = message.guild.members.get(search);

    // Check if the member is not found and there are mentions.
    if (!member && message.mentions.members) {
        member = message.mentions.members.first();
    }

    // Check if there is no member and attempt to find by name.
    if (!member && search) {
        member = message.guild.members.find(
            member =>
                member.displayName.toLowerCase().includes(search) ||
                member.user.tag.toLowerCase().includes(search)
        );
    }

    // If there is still no member, get the author of the message.
    if (!member) member = message.member;

    return member;
}
