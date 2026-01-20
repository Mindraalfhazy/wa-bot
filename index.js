import express from "express";

const app = express();
app.use(express.json());

// === GANTI DENGAN TOKEN BARU NANTI (jangan hardcode kalau sudah paham env) ===
const ACCESS_TOKEN = "EAAsejZBkbyl4BQuhqyCZCQ12ddPDZCGQUZCAQpgLFwxrR4EsPdzyZCB62L7u0jEDY4kuOOk00fjoTlrSvH4DQYBw705ST0CwXN0zvj8OXuOZCo1uLqTj8VHm6if5FhQ2zk9LpW3CMHa3GFZAGnZCysirLvgYUXoIW7XzrZCZBFuCSyNvZB8ZC1B3ZC8YEQyvefTjrXfTIjwZDZD";
const VERIFY_TOKEN = "Indr@05Juni2001";
const PHONE_NUMBER_ID = "870312589508813";

// Root test
app.get("/", (req, res) => {
  res.send("✅ WA Bot aktif dan online!");
});

// Verifikasi webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Terima pesan masuk
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("📩 Dari:", from);
    console.log("💬 Pesan:", text);

    // Auto reply
    await sendMessage(from, `Halo 👋\nPesanmu: "${text}" sudah saya terima.`);

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

// Fungsi kirim pesan
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });

  const data = await response.json();
  console.log("📤 Meta response:", data);
}

// Railway port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
