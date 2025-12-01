import redis from "../redis/redisClient.js";
export async function deleteData(req,res){
 try{
    
    } catch (err){
        return res.status(500).json({error: "Server error", details: err});
}}
