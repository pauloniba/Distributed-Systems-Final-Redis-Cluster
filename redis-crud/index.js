const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());


const cluster = new Redis.Cluster([
  { host: "redis1", port: 6379 },
  { host: "redis2", port: 6379 },
  { host: "redis3", port: 6379 },
]);

cluster.on("connect", () => {
  console.log("Connected to Redis Cluster");
});

cluster.on("error", (err) => {
  console.error("Redis Cluster Error:", err);
});


app.get("/", (req, res) => {
  res.send("Redis Distributed CRUD + Leaderboard API is running 😎🔥");
});



app.post("/create", async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value)
    return res.status(400).json({ error: "Key and value are required" });

  await cluster.set(key, value);
  res.json({ message: "Created", key, value });
});


app.get("/read/:key", async (req, res) => {
  const value = await cluster.get(req.params.key);
  res.json({ key: req.params.key, value });
});


app.put("/update", async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value)
    return res.status(400).json({ error: "Key and value are required" });

  await cluster.set(key, value);
  res.json({ message: "Updated Complete", key, value });
});


app.delete("/delete/:key", async (req, res) => {
  await cluster.del(req.params.key);
  res.json({ message: "Deletion Complete", key: req.params.key });
});

// Leaderboard api functions


// get function to show all players in the leaderboard 
app.get("/leaderboard/all", async (req, res) => {
  const results = await cluster.zrevrange(
    "leaderboard",
    0,
    -1,
    "WITHSCORES"
  );

  const formatted = [];
  for (let i = 0; i < results.length; i += 2) {
    formatted.push({
      player: results[i],
      score: parseInt(results[i + 1]),
    });
  }

  res.json({ leaderboard: formatted });
});

// api to add player or update player score
app.post("/leaderboard/score", async (req, res) => {
  const { player, score } = req.body;

  if (!player || score === undefined)
    return res.status(400).json({ error: "Player and score required" });

  await cluster.zadd("leaderboard", score, player);
  res.json({ message: "Score updated", player, score });
});

// automatically sorts the leaderboard using playerscore
app.post("/leaderboard/incr", async (req, res) => {
  const { player, amount } = req.body;

  if (!player || amount === undefined)
    return res.status(400).json({ error: "Player and amount required" });

  const newScore = await cluster.zincrby("leaderboard", amount, player);
  res.json({ message: "Score increased", player, newScore });
});

// will show the top number of platers
app.get("/leaderboard/top/:n", async (req, res) => {
  const n = parseInt(req.params.n);

  const results = await cluster.zrevrange(
    "leaderboard",
    0,
    n - 1,
    "WITHSCORES"
  );

  // will convert the array into a json format
  const formatted = [];
  for (let i = 0; i < results.length; i += 2) {
    formatted.push({
      player: results[i],
      score: parseInt(results[i + 1]),
    });
  }

  res.json({ top: formatted });
});

// just a get function to retrieve the rank of a player
app.get("/leaderboard/rank/:player", async (req, res) => {
  const player = req.params.player;

  const rank = await cluster.zrevrank("leaderboard", player);

  res.json({
    player,
    rank: rank === null ? "Not Found" : rank,
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(` API running on port ${PORT}`);
});
