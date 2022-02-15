module.exports = {

  name: 'komanda',
  aliases: [ 'команда' ],
  execute: (message, arguments) => {
    message.channel.send('какая команда? о чем ты? нет никакой команды!');
  }

}