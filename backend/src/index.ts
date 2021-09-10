import express from 'express'
import http from 'http'
import WebSocket from 'ws'

const port = 6969
const server = http.createServer(express)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
  ws.on('message', (data: Buffer) => {
    Buffer.isBuffer(data) && data.byteLength && wss.clients.forEach(client => {
      client !== ws && client.readyState === WebSocket.OPEN && client.send(data)
    })
  })
})

server.listen(port, () => console.log(`Server is listening on ${port}!`))