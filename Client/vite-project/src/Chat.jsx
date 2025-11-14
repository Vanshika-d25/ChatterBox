import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:6001'); // Update if backend is hosted elsewhere

function Chat({ username, room }) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

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

  // -------------------------
  // 🎤 VOICE RECOGNITION SETUP
  // -------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US"; // You can change this or make it dynamic
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // Add voice transcription to input box
      setMessage(transcript);

      // OPTIONAL: Automatically send after speaking
      sendMessage();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!listening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h4 className="text-primary">
          💬 Welcome to Room: <span className="text-dark">{room}</span>
        </h4>
        <p className="text-muted">
          You are chatting as <strong>{username}</strong> ✨
        </p>
      </div>

      <div
        className="border rounded-4 p-3 bg-white shadow-sm mb-4"
        style={{ height: '350px', overflowY: 'scroll' }}
      >
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 px-3 rounded-3 w-75 ${
              msg.author === username
                ? 'ms-auto bg-success text-white'
                : 'me-auto bg-light text-dark'
            }`}
            style={{ maxWidth: '75%' }}
          >
            <div className="fw-semibold">{msg.author}</div>
            <div>{msg.message}</div>
            <div
              className="text-end"
              style={{ fontSize: '0.75em', opacity: 0.7 }}
            >
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------- */}
      {/* Input + Send + MIC UI   */}
      {/* ----------------------- */}
      <div className="input-group">
        <input
          type="text"
          className="form-control rounded-start-pill shadow-sm"
          placeholder="Type a message... ✍️"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        {/* 🎤 MIC BUTTON */}
        <button
          className={`btn ${listening ? 'btn-danger' : 'btn-secondary'} px-3`}
          onClick={toggleListening}
          title="Voice Input"
        >
          {listening ? '🎙️ Listening...' : '🎤'}
        </button>

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
