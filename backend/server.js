const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require("./database");
const { redis_client, redis_port } = require("./redis");
require("dotenv").config({
  path: "./config/config.env",
});

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const itemsRouter = require("./routes/items.js");
const usersRouter = require("./routes/users.js");
const basketRouter = require("./routes/basket.js");
const orderRouter = require("./routes/orders");
const searchRouter = require("./routes/redis_search");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/items", itemsRouter);
app.use("/users", usersRouter);
app.use("/basket", basketRouter);
app.use("/order", orderRouter);
app.use("/search", searchRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Page not founded",
  });
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});

redis_client.on("connect", () => {
  console.log("connected to Redis on port: " + redis_port);
});
