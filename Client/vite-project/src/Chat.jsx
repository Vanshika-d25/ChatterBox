import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:6001'); // Update if backend is hosted elsewhere

function Chat({ username, room }) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const data = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit('send_message', data);
      setChatMessages((prev) => [...prev, data]);
      setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h4 className="text-primary">💬 Welcome to Room: <span className="text-dark">{room}</span></h4>
        <p className="text-muted">You are chatting as <strong>{username}</strong> ✨</p>
      </div>

      <div
        className="border rounded-4 p-3 bg-white shadow-sm mb-4"
        style={{ height: '350px', overflowY: 'scroll' }}
      >
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 px-3 rounded-3 w-75 ${
              msg.author === username ? 'ms-auto bg-success text-white' : 'me-auto bg-light text-dark'
            }`}
            style={{ maxWidth: '75%' }}
          >
            <div className="fw-semibold">{msg.author}</div>
            <div>{msg.message}</div>
            <div className="text-end" style={{ fontSize: '0.75em', opacity: 0.7 }}>
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control rounded-start-pill shadow-sm"
          placeholder="Type a message... ✍️"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="btn btn-success rounded-end-pill px-4 shadow-sm"
          onClick={sendMessage}
        >
          🚀 Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
