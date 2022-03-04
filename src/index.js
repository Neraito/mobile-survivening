global.__main = __dirname;

require('dotenv').config();
const config = require(`${__main}/config/config.json`);
const { Client, Intents } = require('discord.js');


global.bot = new Client({ intents: new Intents(config.intents) });


bot.on('ready', () => {
  
  console.log("Привет батон, я обьелся.");
  
  /*bot.guilds.resolve('906583160635133983').members.fetch()
    .then((members) => {
      for (let member of members) console.log(member[1].user);
    });*/
  
});

bot.on('messageCreate', (message) => {

  const prefix = '$$';
  const content = message.content.trim();

  if (message.author.bot) return;
  if (!content.startsWith(prefix)) return;

  let splittedContent = content.replace(/\s+/g, ' ').split(' ');

  let commandName;
  let commandArguments;
  if (splittedContent[0] == prefix) {
    commandName = splittedContent[1];
    commandArguments = splittedContent.slice(2);
  }
  else {
    commandName = splittedContent[0].slice(prefix.length);
    commandArguments = splittedContent.slice(1);
  }

  const fs = require('fs');
  const commands = fs.readdirSync(`${__main}/commands/`).filter(f => f.endsWith(".js"));

  for (let command of commands) {
    command = require(`${__main}/commands/${command}`);
    if (commandName == command.name) return command.execute(message, commandArguments);
    if (command.aliases.includes(commandName)) return command.execute(message, commandArguments);
  }

});

/*bot.on('messageCreate', (message) => {
  
  //console.log(message)
  if (message.author.bot) return
  
  
  /*if (message.content.toLowerCase() == "привет") {
    message.channel.send('О привет, как дела?')
  }
  else message.channel.send(message.content)*//*
  
  const messageData = {};
  messageData.channel = message.channel.name;
  messageData.channelId = message.channelId;
  messageData.content = message.content;
  messageData.messageId = message.id;
  messageData.author = message.author;
  
  console.log(messageData)
  const chan = message.guild.channels.resolve('933071567670345788')
  chan.send(`\`\`\`js\n${util.inspect(messageData)}\n\`\`\``)
  
  
  
});*/
const { Util } = require('discord.js');
const util = require('util');
const { Buffer } = require('buffer');
bot.on('messageCreate', async (message) => {
  
  if (message.author.bot) return;
  if (message.channelId == '933420681801130034') return;
  if (message.author.id != '612409053955620898' && message.author.id != '844577235788759069') return;
  console.log(message.content);
  
  
  if (message.content.startsWith('ev```js')) {
    
    const codeLength = message.content.length - 3;
    let code = message.content.slice(8, codeLength);
    console.log(code);
    
    myEvalCodeBuild(message, code)
    
  } // ======================================================================//
  else if (message.content.startsWith('ev')) {
    
    let code = message.content.slice(3);
    console.log(code);
    
    myEvalCodeBuild(message, code)
    
  } // ======================================================================//
  else if (message.content.startsWith('build')) {
    let content = message.content.slice(6);
    let codeMessagesIds = content.split('%%');
    
    let piecesChan = codeMessagesIds[0]
    let lastCode = codeMessagesIds.at(-1)
    
    console.log(codeMessagesIds)
    console.log(piecesChan)
    console.log(lastCode)
    
    console.log('ok')
    //codeMessagesIds = codeMessagesIds.shift()
    console.log(codeMessagesIds)
    codeMessagesIds = codeMessagesIds.slice(1, -1)
    console.log(codeMessagesIds)
    
    let codeTemp = [];
    let isAsync = false;
    codeMessagesIds.forEach(async (id) => {
      
      let msg = await bot.channels.resolve(piecesChan).messages.fetch(id);
      console.log(msg.content)
      if (msg.content.startsWith('bev')) {
        let msgContentTemp = msg.content.slice(3)
        codeTemp.push(msgContentTemp)
      }
      else if (msg.content.startsWith('bev async')) {
        let msgContentTemp = msg.content.slice(9)
        codeTemp.push(msgContentTemp)
        isAsync = true
      }
      else if (msg.content.startsWith('bev```js\n')) {
        let msgContentTemp = msg.content.slice(9, msg.content.length - 3)
        console.log(msgContentTemp)
        codeTemp.push(msgContentTemp)
      }
      else if (msg.content.startsWith('bev```js\nasync')) {
        let msgContentTemp = msg.content.slice(14, msg.content.length - 3)
        codeTemp.push(msgContentTemp)
        isAsync = true
      }
      
    })
    console.log(codeTemp)
    let code = (isAsync == true) ? 'async' : ''
    console.log(code)
    code = code + codeTemp.join()
    console.log(code)
    
    if (lastCode.startsWith('ev```js')) {
      const codeLength = lastCode.length - 3;
      let lastCodeTemp = lastCode.slice(8, codeLength);
      code = code + lastCodeTemp;
      console.log(code);
      //myEvalCodeBuild(message, code)
    }
    else if (lastCode.startsWith('ev')) {
      let lastCodeTemp = lastCode.slice(3);
      code = code + lastCodeTemp
      console.log(code);
      //myEvalCodeBuild(message, code)
    }
    
  }
  
});
async function myEvalCodeBuild(message, code) {
    if (code.startsWith('async')) {
      code = code.slice(5);
      code = [
            'const japon = {',
              'log: (variable) => { jlog(jpm, 0, variable) },',
              'log2: (variable, depth) => { jlog(jpm, depth, variable) },',
              'log3: (variable) => { jlog2(jpm, variable) }',
            '}',
            code
      ].join('\n');
      code = [
            '(async () => {',
              'try {',
                `${code}`,
              '} catch(err) {',
                'return {error: err.name, message: err.message}',
              '}',
            '})()'
      ].join('\n');
    }
    else {
      code = [
            'const japon = {',
              'log: (variable) => { jlog(jpm, 0, variable) },',
              'log2: (variable, depth) => { jlog(jpm, depth, variable) },',
              'log3: (variable) => { jlog2(jpm, variable) }',
            '}',
            code
      ].join('\n');
    }
    console.log(code);
    
    
    const output = await myEval(message, Util, util, code);
    
    
    let codeOutput = `${util.inspect(output, { depth: 2, showHidden: true })}`;
    let cleanOutput = Util.cleanCodeBlockContent(codeOutput);
    
    if (cleanOutput.length > 2000) {
      codeOutput = `${util.inspect(output, { depth: 1, showHidden: true })}`;
      cleanOutput = Util.cleanCodeBlockContent(codeOutput);
    }
    if (cleanOutput.length > 2000) {
      codeOutput = `${util.inspect(output, { depth: 0, showHidden: true })}`;
      cleanOutput = Util.cleanCodeBlockContent(codeOutput);
    }
    
    
    if (cleanOutput.length > 2000) {
      return message.channel.send({
        files: [{ attachment: Buffer.from(codeOutput), name: 'output.txt' }]
      });
    }
    
    return message.channel.send(`\`\`\`js\n${cleanOutput}\n\`\`\``);
    
}
async function myEval(jpm, Util, util, code) {
  let result;
  try {
    const jlog = (msg, depth, variable) => {
      console.log(typeof variable);
      let codeOutput = `${util.inspect(variable, { depth: depth, showHidden: true })}`;
      let cleanOutput = Util.cleanCodeBlockContent(codeOutput);
      
      if (cleanOutput.length > 2000) {
            msg.channel.send({
              files: [{ attachment: Buffer.from(codeOutput), name: 'output.txt' }]
            });
      } else {
            msg.channel.send(`\`\`\`js\n${cleanOutput}\n\`\`\``);
      }
    };
    
    const jlog2 = (msg, variable) => {
          //console.log(variable)
      if (variable.length > 2000) {
            msg.channel.send({
              files: [{ attachment: Buffer.from(variable), name: 'output.txt' }]
            });
      } else {
            msg.channel.send(variable);
      }
    };
    result = eval(code);
    console.log(result);
  }
  catch (err) {
    result = {error: err.name, message: err.message, stack: err.stack};
  }
  return result;
}


process.on('uncaughtException', (err) => {
  console.log('Ошибка ять: ' + err);
})


/*bot.on('messageReactionAdd', (message) => {
  console.log(message)
  message.message.channel.send("жабайка тыкает реакции.");
});*/

bot.login(process.env.TOKEN);
