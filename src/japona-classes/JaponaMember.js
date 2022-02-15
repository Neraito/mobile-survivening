module.exports = class JaponaMember {
  #member;
  constructor (member, japonaGuild) {
    this.#member = member;
    this.id = member.id;
    this.mention = `<@${member.id}>`;
    this.nickname = (member.nickname) ? member.nickname : member.user.username;
    this.tag = member.user.tag;
    this.name = member.user.username;
    this.bot = member.user.bot;
    this.discriminator = member.user.discriminator;
    this.joinedAt = member.joinedAt;
    this.createdAt = member.user.createdAt;
    this.status = member.presence?.status,
    this.avatarUrl = member.user.avatarURL();
    this.rank = 'я не лиса, нет у меня рейтинга, дуй отсюда';
    this.roles = member.roles.cache.toJSON();
    this.guild = japonaGuild;
    this.attributes = 'я тебе база данных чтоли, держи свои аттрибуты при себе';
    this.activities = member.presence?.activities;
  }
};