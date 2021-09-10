"use strict";
var Chat = /** @class */ (function () {
    function Chat() {
        this.WEBSOCKET_URL = 'ws://localhost:6969';
        this.ws = new WebSocket(this.WEBSOCKET_URL);
        this.ws.binaryType = 'arraybuffer';
        this.messages = document.querySelector('#messages');
        this.messageBox = document.querySelector('#messageInput');
    }
    Chat.prototype.init = function () {
        this.connectToWebSocket();
        this.sendMessage();
    };
    Chat.prototype.showMessage = function (message) {
        if (this.messages !== null && this.messageBox !== null) {
            this.messages.textContent += "\n" + message;
            this.messages.scrollTop = this.messages.scrollHeight;
            this.messageBox.value = '';
        }
    };
    Chat.prototype.sendMessage = function () {
        var _this = this;
        if (this.messageBox) {
            this.messageBox.onkeyup = function (e) {
                var _a, _b, _c;
                var key = e.which || e.keyCode;
                if (key == 13) {
                    var encoder = new TextEncoder();
                    var encodedMessage = encoder.encode((_a = _this.messageBox) === null || _a === void 0 ? void 0 : _a.value);
                    if (!_this.ws) {
                        _this.showMessage('No WebSocket connection :(');
                        return;
                    }
                    console.group('Message buffer');
                    console.log(encodedMessage.buffer);
                    console.groupEnd();
                    _this.ws.send(encodedMessage.buffer);
                    if ((_b = _this.messageBox) === null || _b === void 0 ? void 0 : _b.value) {
                        _this.showMessage((_c = _this.messageBox) === null || _c === void 0 ? void 0 : _c.value);
                    }
                }
            };
        }
    };
    Chat.prototype.connectToWebSocket = function () {
        var _this = this;
        this.ws.onopen = function () {
            console.log('Connection opened!');
        };
        this.ws.onmessage = function (event) {
            var decoder = new TextDecoder();
            var decodedMessage = decoder.decode(event.data);
            _this.showMessage(decodedMessage);
        };
        this.ws.onclose = function () { return _this.ws = null; };
    };
    return Chat;
}());
var chat = new Chat();
chat.init();
