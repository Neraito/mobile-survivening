module.exports = {

  name: 'hi',
  aliases: [ 'привет', 'прив' ],
  execute: (message, arguments) => {
    message.channel.send(`пока <@${message.author.id}>`);
  }

}