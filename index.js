import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import pino from "pino"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update

    if (qr) {
      console.log("📸 Scan QR ini pakai WhatsApp:")
      console.log(qr)
    }

    if (connection === "open") {
      console.log("✅ Bot WhatsApp aktif!")
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const sender = msg.key.remoteJid

    await sock.sendMessage(sender, {
      text: `Halo 👋\nTerima kasih sudah menghubungi GadgetFix.\n\nBalas:\n1️⃣ Servis HP\n2️⃣ Servis Laptop\n3️⃣ Konsultasi`
    })
  })
}

startBot()
