"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const port = 6969;
const server = http_1.default.createServer(express_1.default);
const wss = new ws_1.default.Server({ server });
wss.on('connection', ws => {
    ws.on('message', (data) => {
        Buffer.isBuffer(data) && data.byteLength && wss.clients.forEach(client => {
            client !== ws && client.readyState === ws_1.default.OPEN && client.send(data);
        });
    });
});
server.listen(port, () => console.log(`Server is listening on ${port}!`));
