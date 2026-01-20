import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WA Bot aktif 🚀");
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "Indr@05Juni2001";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("Pesan masuk:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
