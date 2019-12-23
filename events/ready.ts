import Bot from '../bot';

module.exports = (client: Bot) => {
    console.log(`Bot is ready: ${client.user.username}`);

    // Set presence.
    client.user.setActivity('Developing...');
};
