import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({port: 8080});

let userCount = 0
let allSockets : WebSocket[] = [];

ws.on("connection", (socket) => {

    allSockets.push(socket)

    userCount += 1;
    console.log("User connected #" + userCount);

    socket.on("message", (message)=>{
        console.log("Message received " + message.toString());

        allSockets.forEach((s) => {
            s.send(message.toString());
        })
    })


})