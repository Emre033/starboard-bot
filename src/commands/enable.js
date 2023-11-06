const discord_gg_akparti = require("discord.js");
const dbAyranCodeShare = require("croxydb");
module.exports = {
    slash: new discord_gg_akparti.SlashCommandBuilder()
        .setName("starboard-aktif-et")
        .setDescription("Starboard sistemini aktif eder.")
        .addChannelOption((option) =>
            option
                .setName("kanal")
                .setDescription("Starboard kanalını belirtin.")
                .setRequired(true)
                .addChannelTypes(discord_gg_akparti.ChannelType.GuildText)
        )
        .addStringOption((option) =>
            option
                .setName("emoji")
                .setDescription("Starboard için emoji belirtin.")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("sayı")
                .setDescription("Starboard için kaç tane emojiye ihtiyaç olduğunu belirtin.")
                .setRequired(true)
        ),
    // https://discordjs.guide/slash-commands/advanced-creation.html#adding-options
    /**
     * 
     * @param {discord_gg_akparti.Client} client 
     * @param {discord_gg_akparti.ChatInputCommandInteraction} interaction 
     * @returns 
     */
    execute: async (client, interaction) => {
        if (!interaction.inCachedGuild()) return interaction.reply("Bu komutu sadece sunucularda kullanabilirsiniz.")
        // check if user is an admin
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return interaction.reply("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.");
        if (dbAyranCodeShare.has(`starboard_config_${interaction.guild.id}`)) return interaction.reply("Starboard sistemi zaten aktif.");
        // check if i am an admin
        if (!interaction.guild.members.me.permissions.has("ADMINISTRATOR"))
            return interaction.reply("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalıyım.");
        // get channel
        const channel = interaction.options.getChannel("kanal");
        // get emoji
        const emoji = discord_gg_akparti.parseEmoji(interaction.options.getString("emoji"))
        // check if emoji is valid
        if (!emoji)
            return interaction.reply("Geçersiz emoji.");
        // check if bot can use emoji
        if (emoji.id && !(await interaction.guild.emojis.fetch()).has(emoji.id))
            return interaction.reply("Bu emoji sunucuda bulunmuyor.");
        // get number
        const number = interaction.options.getInteger("sayı");
        // check if number is valid
        if (number < 1 || number > 100)
            return interaction.reply("Geçersiz sayı.");
        dbAyranCodeShare.set(`starboard_config_${interaction.guild.id}`, {
            channel: channel.id,
            emoji: emoji,
            number: number,
        });
        await interaction.reply("Starboard sistemi aktif edildi.");
        
    }
}
