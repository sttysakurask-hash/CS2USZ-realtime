const express = require("express");
const {GameDig} = require("gamedig");
const path = require("path");
const app = express();
const PORT = 3000;

const servers = [
  { id:"dm", name:"CS2USZ Deathmatch", type:"Deathmatch", host:"94.158.55.208", port:27024 },
  { id:"duels", name:"CS2USZ Duels", type:"Duels", host:"94.158.55.208", port:27031 },
  { id:"public", name:"CS2USZ Public", type:"Public", host:"94.158.55.208", port:27032 }
];

async function queryServer(s){
  try{
    const state = await GameDig.query({type:"counterstrike2",host:s.host,port:s.port,maxAttempts:2,socketTimeout:2500});
    return {...s,online:true,players:state.players?.length ?? 0,maxPlayers:state.maxplayers ?? 0,map:state.map || "unknown",ping:state.ping ?? null};
  }catch(e){
    return {...s,online:false,players:0,maxPlayers:0,map:"offline",ping:null};
  }
}
app.use(express.static(path.join(__dirname,"public")));
app.get("/api/servers",async(_req,res)=>res.json({updatedAt:new Date().toISOString(),servers:await Promise.all(servers.map(queryServer))}));
app.listen(PORT,()=>console.log(`CS2USZ realtime server: http://localhost:${PORT}`));
