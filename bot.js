const Discord = require('discord.js');
const { Client } = require('lmstudio-sdk');

// Import required modules
require('dotenv').config();

// Create a new Discord client
const client = new Discord.Client();

// Create a new LMStudio client
const lmstudioClient = new Client({
    baseUrl: 'ws://192.168.0.178:1234', // Replace with your LMStudio server address
});

// Event handler for when the bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for incoming messages
client.on('message', async (message) => {
    if (message.author.bot) {
        if (message.content === '.reboot') {
            // Restart the bot if the message content is ".kill
            await restartBot();
        } else if (message.content === '.ping') {
            // Reply with "Pong!" if the message content is ".ping"
            message.channel.send('Pong!');
        } else if (message.content === '.shutdown') {
            // Shut down the bot if the message content is ".shutdown"
            process.exit();
        } else {
            // Filter the message content if the message content is ".filter"
            const filteredMessage = filter(message.content);
            // Send the message to LMStudio for processing
            const response = await lmstudioClient.llm.query('TheBloke/SOLAR-10.7B-Instruct-v1.0-uncensored-GGUF/solar-10.7b-instruct-v1.0-uncensored.Q4_K_S.gguf', filteredMessage.content);
            message.channel.send(response.text);
        }

        return;
    };
});

filter = (message) => {
    const filteredWords = require('./fw.json');
    return message.split(' ').map(word => {
        return filteredWords.includes(word.toLowerCase()) ? ' ' : word;
    }).join(' ');
};

// Filter the message content if the message content is ".filter"
const filteredMessage = filter(message.content);
message.channel.send(filteredMessage);

// Function to restart the bot
async function restartBot() {
    try {
        // Log out of Discord
        await client.destroy();

        // Log out of LMStudio
        await lmstudioClient.destroy();

        // Restart the bot by running the script again
        require('/e:/js-discord-lmstudio-bot/bot.js');
    } catch (error) {
        console.error('Error restarting bot:', error);
    }
}

// Event handler for incoming messages
client.on('message', async (message) => {
    if (message.author.bot) {

        // Ignore messages from other bots

        return;
    };
});

// Log in to Discord using the bot token from .env file
client.login(process.env.TOKEN);

// Log in to LMStudio using the owner and guild from .env file
lmstudioClient.login(process.env.OWNER, process.env.GUILD);