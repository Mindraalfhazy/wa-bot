import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    console.log("Pesan masuk:", text);

    // auto balas
    await sock.sendMessage(msg.key.remoteJid, {
      text: "Bot aktif ✅\nPesan kamu: " + text
    });
  });
}

startBot();
