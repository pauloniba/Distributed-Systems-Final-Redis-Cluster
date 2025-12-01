import redis from "../redis/redisClient.js";

export async function updateData(req, res) {
  try {
    const { id, name, email, score } = req.body;
    if (!id) {
    return res.status(400).json({ error: "id required" });
      
  }
} catch (err){
        return res.status(500).json({error: "Server error", details: err});
}}
