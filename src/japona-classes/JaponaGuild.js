const JaponaMember = require('./JaponaMember');

module.exports = class JaponaGuild {
  #guild;
  constructor(guildId) {
    const guild = bot.guilds.resolve(guildId);
    this.#guild = guild;
    this.id = guild.id;
    this.name = guild.name;
    this.iconUrl = guild.iconURL();
    this.afkTimeout = guild.afkTimeout;
    this.afkChannel = guild.channels.resolve(guild.afkChannelId);
    this.memberCount = guild.memberCount;
    this.createdAt = guild.createdAt;
    this.owner = this.getMember(guild.ownerId);
    this.selfMember = this.getMember(guild.me.id);
    this.boostCount = guild.premiumSubscriptionCount;
  }
  getMember(memberId) {
    const member = this.#guild.members.resolve(memberId);
    return new JaponaMember(member, this);
  }
};