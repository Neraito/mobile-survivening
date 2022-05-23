global.__main = __dirname;

require('dotenv').config();
const config = require(`${__main}/config/config.json`);
const { Client, Intents } = require('discord.js');


global.bot = new Client({ intents: new Intents(config.intents) });

process.on('uncaughtException', (err) => {
  console.log('Ошибка ять: ' + err);
})


const { Util } = require('discord.js');
const util = require('util');
const { Buffer } = require('buffer');

bot.on('ready', () => {  console.log("Привет батон, я обьелся.")  });
bot.on('messageCreate', async (message) => { evalPocalypse(message) });
    
async function evalPocalypse(message) {
  
  if (message.author.bot) return;
  if (message.channelId == '933420681801130034') return;
  if (!process.env.EVALERS.includes(message.author.id)) return;
  console.log(message.content);
  
  if (message.content.startsWith(process.env.PFX+'```js')) {
    
    const codeLength = message.content.length - 3;
    let code = message.content.slice(8, codeLength);
    console.log(code);
    
    myEvalCodeBuild(message, code)
    
  } // ======================================================================//
  else if (message.content.startsWith(process.env.PFX)) {
    
    let code = message.content.slice(3);
    console.log(code);
    
    myEvalCodeBuild(message, code)
    
  } // ======================================================================//
  else if (message.content.startsWith(process.env.PFX+'ild')) {
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
    await codeMessagesIds.forEach(async (id) => {
      
      let msg = await bot.channels.resolve(piecesChan).messages.fetch(id);
      console.log(msg.content)
      if (msg.content.startsWith('b'+process.env.PFX+'```js\nasync')) {
        let msgContentTemp = msg.content.slice(15, msg.content.length - 3)
        console.log(msgContentTemp)
        codeTemp.push(msgContentTemp)
        isAsync = true
      }
      else if (msg.content.startsWith('b'+process.env.PFX+'```js\n')) {
        let msgContentTemp = msg.content.slice(9, msg.content.length - 3)
        console.log(msgContentTemp)
        codeTemp.push(msgContentTemp)
      }
      else if (msg.content.startsWith('b'+process.env.PFX+' async')) {
        let msgContentTemp = msg.content.slice(10)
        codeTemp.push(msgContentTemp)
        isAsync = true
      }
      else if (msg.content.startsWith('b'+process.env.PFX)) {
        let msgContentTemp = msg.content.slice(4)
        codeTemp.push(msgContentTemp)
      }
      
    })
    console.log(codeTemp)
    let code = (isAsync == true) ? 'async\n' : ''
    console.log(code)
    code = code + codeTemp.join('\n')
    console.log(code)
    
    if (lastCode.startsWith(process.env.PFX+'```js')) {
      const codeLength = lastCode.length - 3;
      let lastCodeTemp = lastCode.slice(8, codeLength);
      code = code + lastCodeTemp;
      console.log(code);
      myEvalCodeBuild(message, code)
    }
    else if (lastCode.startsWith(process.env.PFX)) {
      let lastCodeTemp = lastCode.slice(3);
      code = code + lastCodeTemp
      console.log(code);
      myEvalCodeBuild(message, code)
    }
    
  }
  
}
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
    
    if (cleanOutput.length > 1800) {
      codeOutput = `${util.inspect(output, { depth: 1, showHidden: true })}`;
      cleanOutput = Util.cleanCodeBlockContent(codeOutput);
    }
    if (cleanOutput.length > 1800) {
      codeOutput = `${util.inspect(output, { depth: 0, showHidden: true })}`;
      cleanOutput = Util.cleanCodeBlockContent(codeOutput);
    }
    if (cleanOutput.length > 1800) {
      return message.channel.send({
        files: [{ attachment: Buffer.from(codeOutput.replaceAll(process.env.TOKEN, '[удалено]')), name: 'output.txt' }]
      });
    }
    
    return message.channel.send(`\`\`\`js\n${cleanOutput.replaceAll(process.env.TOKEN, '[удалено]')}\n\`\`\``);
    
}
async function myEval(jpm, Util, util, code) {
  let result;
  try {
    const jlog = (msg, depth, variable) => {
      console.log(typeof variable);
      let codeOutput = `${util.inspect(variable, { depth: depth, showHidden: true })}`;
      let cleanOutput = Util.cleanCodeBlockContent(codeOutput);
      
      if (cleanOutput.length > 1800) {
            msg.channel.send({
              files: [{ attachment: Buffer.from(codeOutput), name: 'output.txt' }]
            });
      } else {
            msg.channel.send(`\`\`\`js\n${cleanOutput}\n\`\`\``);
      }
    };
    const jlog2 = (msg, variable) => {
          //console.log(variable)
      if (variable.length > 1800) {
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


/*bot.on('messageReactionAdd', (message) => {
  console.log(message)
  message.message.channel.send("жабайка тыкает реакции.");
});*/

bot.login(process.env.TOKEN);
