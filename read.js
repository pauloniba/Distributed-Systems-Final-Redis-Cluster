import redis from "../redis/redisClient.js";

export async function readData(req,res){
try{
    const {id} = req.params;

    if(!id){
    return res.status(400).json({error:"USER ID REQUIRED"});
    }

    const key = 'user:${id}';
    const data = await redis.hgetall(key);

    if(!data || Object.keys(data).length === 0 ) {
        return res.status(404).json({error: "User not found"});
    }

    return res.json({
        id,
        data
    });
}catch(err){
    return res.status(500).json({error: "Server Error"});
}
}
