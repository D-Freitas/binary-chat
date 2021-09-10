class Chat {
  private readonly WEBSOCKET_URL = 'ws://localhost:6969'

  private ws: WebSocket | null
  
  private messages: HTMLPreElement | null
  private messageBox: HTMLInputElement | null

  constructor() {
    this.ws = new WebSocket(this.WEBSOCKET_URL)
    this.ws.binaryType = 'arraybuffer'

    this.messages = document.querySelector('#messages')
    this.messageBox = document.querySelector('#messageInput')
  }

  public init() {
    this.connectToWebSocket()
    this.sendMessage()
  }

  private showMessage(message: string) {
    if (this.messages !== null && this.messageBox !== null) {
      this.messages.textContent += `\n${message}`
      this.messages.scrollTop = this.messages.scrollHeight
      this.messageBox.value = ''
    }
  }

  private sendMessage() {
    if (this.messageBox) {
      this.messageBox.onkeyup = e => {
        const key = e.which || e.keyCode

        if (key == 13) {
          const encoder = new TextEncoder()
          const encodedMessage = encoder.encode(this.messageBox?.value)
          
           if (!this.ws) {
            this.showMessage('No WebSocket connection :(')
            return
          }
          
          console.group('Message buffer')
          console.log(encodedMessage.buffer)
          console.groupEnd()

          this.ws.send(encodedMessage.buffer)

          if (this.messageBox?.value) {
            this.showMessage(<string>this.messageBox?.value) 
          }
        }
      }
    }
  }

  private connectToWebSocket() {
    (<WebSocket>this.ws).onopen = () => {
      console.log('Connection opened!')
    }

    (<WebSocket>this.ws).onmessage = event => {
      const decoder = new TextDecoder()
      const decodedMessage = decoder.decode(event.data)
      this.showMessage(decodedMessage)
    }

    (<WebSocket>this.ws).onclose = () => this.ws = null
  }
}

const chat = new Chat()
chat.init()