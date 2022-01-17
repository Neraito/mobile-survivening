global.__main = __dirname;

require('dotenv').config();
const config = require(`${__main}/config/config.json`) ;
const { Client, Intents } = require('discord.js');


global.bot = new Client({ intents: new Intents(config.intents) });

bot.on('ready', () => {
  console.log("Привет хозяйка, я проснулся.");
}) ;

bot.login(process.env.TOKEN);
