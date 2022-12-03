import express from "express";
import http from "http";
import {Server} from "socket.io";
const app = express();

app.set("view engine","pug");
app.set("views",__dirname+"/views");
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(_,res)=>res.render("home"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

httpServer.listen(3000,()=>console.log("server run"));