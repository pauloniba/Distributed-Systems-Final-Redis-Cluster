import redis from "../redis/redisClient.js";

export async function updateData(req, res) {
  try {
    const { id, name, email, score } = req.body;
    if (!id) {
      return res.status(400).json({ error: "id required" });
    }
    
    const exists = await redis.exists(key);
    if (!exists) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (score) updates.score = score;
    
  }
  catch (err) {
        return res.status(500).json({error: "Server error", details: err});
  }
}
