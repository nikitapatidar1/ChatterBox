import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(userId) {
    if (this.socket) {
      this.socket.emit('join', userId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send-message', messageData);
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive-message', callback);
    }
  }

  startTyping(typingData) {
    if (this.socket) {
      this.socket.emit('typing-start', typingData);
    }
  }

  stopTyping(typingData) {
    if (this.socket) {
      this.socket.emit('typing-stop', typingData);
    }
  }

  onTypingStart(callback) {
    if (this.socket) {
      this.socket.on('typing-start', callback);
    }
  }

  onTypingStop(callback) {
    if (this.socket) {
      this.socket.on('typing-stop', callback);
    }
  }

  onMessageDelivered(callback) {
    if (this.socket) {
      this.socket.on('message-delivered', callback);
    }
  }

  onMessageSeen(callback) {
    if (this.socket) {
      this.socket.on('message-seen', callback);
    }
  }
}

export default new SocketService();



