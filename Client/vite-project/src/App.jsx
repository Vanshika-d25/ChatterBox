// src/App.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chat from './Chat';
import Header from './components/Header';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Join existing chat room
  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      setShowChat(true);
    }
  };

  // Create a new chat room with a unique ID
  const createRoom = () => {
    if (username.trim()) {
      const newRoomId = uuidv4();
      setRoom(newRoomId);
      setShowChat(true);
    }
  };

  return (
    <div
      className="container mt-5 d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)',
        minHeight: '100vh',
      }}
    >
      {!showChat ? (
        <div
          className="card p-5 shadow-lg rounded-4 border-0 bg-light"
          style={{ maxWidth: '500px', width: '100%' }}
        >
          <Header />

          <input
            type="text"
            className="form-control mb-3 rounded-pill shadow-sm"
            placeholder="✨ Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-4 rounded-pill shadow-sm"
            placeholder="🔐 Enter Room ID to join"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <div className="d-grid gap-3">
            <button
              className="btn btn-primary btn-lg rounded-pill shadow-sm"
              onClick={joinRoom}
            >
              💬 Join Room
            </button>

            <button
              className="btn btn-success btn-lg rounded-pill shadow-sm"
              onClick={createRoom}
            >
              🌟 Create New Room
            </button>
          </div>
        </div>
      ) : (
        <Chat username={username} room={room} />
      )}
    </div>
  );
}

export default App;

//make code more clean and readable