const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log('Client is ready!');
  // Obtener todos los chats
  const chats = await client.getChats();
  chats.forEach((chat) => {
    if (chat.isGroup) {
      console.log(`Group Name: ${chat.name}, Group ID: ${chat.id._serialized}`);
    }
  });
  // Aquí puedes decidir si quieres cerrar el cliente después de obtener la información
  // client.destroy();
});

client.initialize();