import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string
}

let allSockets: User[] = [];

ws.on("connection", (socket) => {


    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type === "chat") {
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;

            allSockets.filter(x => x.room === currentUserRoom)
                .forEach(x => {
                    x.socket.send(parsedMessage.payload.message);
                })
        }
    })


    socket.on("disconnect", () => {
        allSockets = allSockets.filter((x) => x.socket != socket)
    })


})