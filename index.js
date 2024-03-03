const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

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
  console.log("Whatsapp Active!");
  await sendMsg();
});

client.initialize();

const message = `
Hola, este es un mensaje de prueba. Por favor, no responda.
`;

function checkContact(contact) {
  return (contact.includes('@c.us') || contact.includes('@g.us')) || (!isNaN(contact) && contact.length === 12);
}

async function sendMsg() {
  const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
  let contacts = fs.readFileSync("numbers.txt", "utf-8").split("\n");
  console.log(`Total ${contacts.length} contacts found!`);
  let sents = [];
  contacts.forEach(async (contact) => {
    contact = contact.trim();
    if (sents.includes(contact)) {
      console.log(`Already sent: ${contact}`);
      return;
    }
    if (!checkContact(contact)) {
      console.log(`Incorrect contact: ${contact}`);
      return;
    }
    try {
      let chatId = contact.includes('@g.us') ? contact : `${contact}@c.us`;
      await client.sendMessage(chatId, media);
      await client.sendMessage(chatId, message);
      sents.push(contact);
      console.log(`Message sent: ${contact}`);
    } catch (e) {
      console.log(`Failed to send message: ${contact}`);
    }
  });
}