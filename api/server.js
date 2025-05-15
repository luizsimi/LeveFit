// Adaptador para a Vercel serverless
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Importe as rotas do seu backend
const routes = require("../backend/dist/routes");

// Use as rotas no middleware
app.use("/api", routes);

// Trate quaisquer outras solicitações
app.all("*", (req, res) => {
  return res.status(404).json({ message: "Rota não encontrada" });
});

// Crie um servidor HTTP
const server = createServer(app);

// Exporte o manipulador para serverless
module.exports = app;
