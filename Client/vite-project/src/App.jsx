// src/App.jsx
import React, { useState } from 'react';
import Chat from './Chat';
import Header from './components/Header';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // ------------------------------------------------
  // 🌟 BEAUTIFUL ROOM ID GENERATOR
  // ------------------------------------------------
  const generatePrettyRoomId = () => {
    const adjectives = [
      "sunny","bright","silent","magic","happy","silver","golden","cool",
      "rapid","brave","wild","blue","pink","green","fancy","tiny","frozen"
    ];

    const nouns = [
      "ocean","forest","mountain","river","tiger","lotus","phoenix",
      "cloud","planet","flame","garden","storm","valley","castle","island"
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(100 + Math.random() * 900);

    return `${adjective}-${noun}-${number}`;
  };

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      setShowChat(true);
    }
  };

  // ------------------------------------------------
  // 🌟 CREATE ROOM (Using pretty room IDs)
  // ------------------------------------------------
  const createRoom = () => {
    if (username !== '') {
      const newRoomId = generatePrettyRoomId(); 
      setRoom(newRoomId);
      alert(`New Room Created: ${newRoomId}`);
    }
  };

  // ------------------------------------------------
  // 📧 SEND EMAIL INVITATION
  // ------------------------------------------------
  const sendEmailInvitation = async () => {
    if (!inviteEmail) {
      alert("Please enter an email address.");
      return;
    }
    if (!room) {
      alert("Please create or enter a room ID first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:6001/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inviteEmail,
          username,
          room,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Invitation email sent successfully!");
      } else {
        alert("Failed to send invitation email.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending email.");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center min-vh-100" style={{
      background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)',
      minHeight: '100vh',
    }}>
      {!showChat ? (
        <div className="card p-5 shadow-lg rounded-4 border-0 bg-light" style={{ maxWidth: '500px', width: '100%' }}>
          <Header />
          
          {/* Username */}
          <input
            type="text"
            className="form-control mb-3 rounded-pill shadow-sm"
            placeholder="✨ Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Room Input */}
          <input
            type="text"
            className="form-control mb-4 rounded-pill shadow-sm"
            placeholder="🔐 Enter Room ID to join or create"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          {/* 📧 Email Invitation */}
          <input
            type="email"
            className="form-control mb-3 rounded-pill shadow-sm"
            placeholder="📧 Enter email to send Room ID"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <button
            className="btn btn-warning btn-lg rounded-pill shadow-sm mb-3"
            onClick={sendEmailInvitation}
          >
            ✉ Send Room ID via Email
          </button>

          {/* Join + Create Buttons */}
          <div className="d-grid gap-3">
            <button className="btn btn-primary btn-lg rounded-pill shadow-sm" onClick={joinRoom}>
              💬 Join Room
            </button>
            <button className="btn btn-success btn-lg rounded-pill shadow-sm" onClick={createRoom}>
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
