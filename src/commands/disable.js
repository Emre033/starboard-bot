const discord_gg_akparti = require("discord.js");
const dbAyranCodeShare = require("croxydb");
module.exports = {
    slash: new discord_gg_akparti.SlashCommandBuilder()
        .setName("starboard-kapat")
        .setDescription("Starboard sistemini kapatır."),
    /**
        * 
        * @param {discord_gg_akparti.Client} client 
        * @param {discord_gg_akparti.ChatInputCommandInteraction} interaction 
        * @returns 
        */
    execute: async (client, interaction) => {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.", ephemeral: true });
        if (!dbAyranCodeShare.has(`starboard_config_${interaction.guild.id}`)) return interaction.reply({ content: "Captcha sistemi zaten kapalı.", ephemeral: true });
        dbAyranCodeShare.delete(`starboard_${interaction.guild.id}`);
        dbAyranCodeShare.delete(`starboard_config_${interaction.guild.id}`);
        return interaction.reply({ content: "Starboard sistemi kapatıldı.", ephemeral: true });
    }
}
