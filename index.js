const Discord = require("discord.js")
const client = new Discord.Client({
    intents: [ // https://discordjs.guide/popular-topics/intents.html#enabling-intents
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMessageReactions
    ],
    partials:[Discord.Partials.Message,Discord.Partials.Reaction]
})
const config = require("./config.json")
const fs = require("fs")
client.commands = new Discord.Collection();

const komutlarDosyasi = fs.readdirSync('./src/commands/')
// komutları yükleme
for (const kategori of komutlarDosyasi) {
    const commands = fs.readdirSync(`./src/commands/${kategori}`).filter((file) => file.endsWith('.js'));
    for (const file of commands) {
        const dosya = require(`./src/commands/${kategori}/${file}`);
        if (!dosya.execute || !dosya.slash) continue;
        client.commands.set(dosya.slash.name, dosya);
        console.log(`Komut ${dosya.slash.name} yüklendi. (Kategori: ${kategori})`);
    }
}

client.on("ready", async () => {

    client.user.setActivity({ state: "Ayran Codeshare!", name: "Custom Status", type: Discord.ActivityType.Custom })
    try {
        const commands = client.commands.map(module => module.slash);
        await client.application.commands.set(commands);
        console.log('Slash Komutlar yüklendi.');
    } catch (e) {
        console.error(e);
    }

    console.log(`${client.user.tag} olarak bağlanıldı.`)
})
// eventleri yükleme
fs.readdir('./src/events', (err, files) => {
    if (err) return console.error(err);
    files.filter(file => file.endsWith('.js')).forEach(file => {
        const event = require(`./src/events/${file}`);
        const eventad = file.slice(0, -3);
        client.on(eventad, (...args) => event(client, ...args));
        delete require.cache[require.resolve(`./src/events/${file}`)];
    });
});
process.on("uncaughtException", (error) => {
    console.error("Beklenmeyen bir hata oluştu:");
    console.error(error);
  });
  
process.on("unhandledRejection", (reason, promise) =>  {
    console.error("İşlenmemiş bir geri dönüşüm hatası oluştu:");
    console.error("Promise:", promise);
    console.error("Reason:", reason);
});
client.login(config.token || process.env.token).catch(err => {
    console.log("Bota bağlanılamadı. Gereken intentleri açmamış olabilir veya tokeni yanlış girmiş olabilirsiniz:")
    console.log(err)
})