// app/page.js
'use client'; // This directive is crucial for client-side components in App Router

import React, { useState, useEffect } from 'react';
import { useTheme } from './layout'; // Import useTheme from layout.js

// Theme Toggle Button Component
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // State to track if component is mounted

  useEffect(() => {
    setMounted(true); // Set mounted to true once component mounts on the client
  }, []);

  // Render nothing on the server, or until mounted on the client
  if (!mounted) {
    return (
      <button
        className="btn btn-outline-secondary rounded-pill shadow-sm"
        aria-label="Toggle theme"
        disabled // Disable button until mounted to prevent interaction issues
      >
        {/* Optional: Add a subtle placeholder like a blank space or loading spinner */}
        &nbsp;
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary rounded-pill shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.675l.707-.707M6.343 17.657l-.707.707M17.657 6.343l.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isUser }) => {
  // Function to replace newline characters with <br /> for proper rendering
  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <div
        className={`p-2 rounded-3 shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-bottom-0'
            : 'bg-body-secondary text-body rounded-bottom-0'
        }`}
        style={{ maxWidth: '75%' }} // Limiting width for chat bubbles
      >
        <p className="mb-0 small text-break">{formatMessage(message)}</p>
      </div>
    </div>
  );
};

// Main App Component
export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to call the Lyzr AI Agent API
  const callLyzrAIAgentAPI = async (prompt) => {
    setIsLoading(true);
    const apiUrl = '';
    const apiKey = ''; // Your Lyzr API Key

    const payload = {
      user_id: "", // Replace with dynamic user ID if needed
      agent_id: "",
      session_id: "", // Replace with dynamic session ID if needed
      message: prompt
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      // Check for 'message' first, then 'response', then provide a default
      const reply = data.message || data.response || 'Agent did not respond.';
      setMessages(prev => [...prev, { text: reply, isUser: false }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { text: '❌ Error contacting AI agent', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newUserMessage = { text: input, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      await callLyzrAIAgentAPI(input); // Call the Lyzr AI agent with the user's message
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-body-tertiary text-body">
      {/* Head component for metadata is handled by Next.js in App Router via metadata exports */}

      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-light bg-body shadow-sm rounded-bottom-3">
        <div className="container-fluid">
          <h1 className="navbar-brand mb-0 h1 text-primary">ZW-PEA</h1>
          <ThemeToggleButton />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-grow-1 overflow-auto p-3 pb-5"> {/* Added pb-5 for spacing above fixed footer */}
        <div className="container">
          {messages.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-secondary">
              <p className="fs-5">Hello! my name is PEA 👋</p>
              <p className="small">Type a message below to begin 💻</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))
          )}
          {isLoading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="p-2 rounded-3 shadow-sm bg-body-secondary text-body rounded-bottom-0" style={{ maxWidth: '75%' }}>
                <div className="d-flex align-items-center">
                  <span className="spinner-grow spinner-grow-sm text-primary me-2" role="status" aria-hidden="true"></span>
                  <span>Typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Typing Bar (Fixed Footer) */}
      <footer className="fixed-bottom bg-body shadow-lg p-3 rounded-top-3">
        <div className="container d-flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="form-control rounded-pill me-2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary rounded-pill px-4"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};
