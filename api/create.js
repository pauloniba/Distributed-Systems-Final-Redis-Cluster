import redis from "../redis/redisClient.js";
export async function createData(req,res){
 try{
    const { id, name, email, score } = req.body;

    if( !id || !name || !email){
    return res.status(400).json({error: "id,name,and email required"});
    }

    const key = `user:${id}`;
    
    await redis.hset(key, {
    name,
    email,
    score: score ?? 0
    });

    return res.status(201).json({
        message: "User Created",
        key
    });
    } catch (err){
        return res.status(500).json({error: "Server error", details: err});
}}
