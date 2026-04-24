import React, { useEffect, useRef, useState } from "react";
import "./CompanionAI.css";
import { initCompanionAI } from "./CompanionAI.js";

export function CompanionAI() {
  const textRef = useRef(null);
  const sendRef = useRef(null);
  const imgRef = useRef(null);
  const voiceRef = useRef(null);
  const statusRef = useRef(null);
  const aiInstanceRef = useRef(null);
  const responsesContainerRef = useRef(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    aiInstanceRef.current = initCompanionAI({
      textInput: textRef.current,
      sendButton: sendRef.current,
      characterImage: imgRef.current,
      voiceSelect: voiceRef.current,
      status: statusRef.current,
      responsesContainer: responsesContainerRef.current,
      onResponseAdded: (response) => {
        setResponses(prev => [...prev, { id: Date.now(), text: response }]);
      }
    });

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        aiInstanceRef.current?.populateVoiceList();
      };
    } else {
      // populate immediately if voices are already loaded
      aiInstanceRef.current?.populateVoiceList();
    }

    return () => {
      aiInstanceRef.current?.destroy();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []); // runs once on mount

  // Auto-scroll to bottom when new responses are added
  useEffect(() => {
    if (responsesContainerRef.current) {
      setTimeout(() => {
        responsesContainerRef.current.scrollTop = responsesContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [responses]);

  const handleDeleteResponse = (id) => {
    setResponses(prev => prev.filter(response => response.id !== id));
  };

  return (
    <div className="ai-chat-container">
      <header className="ai-chat-header">
        <h1>AI Companion</h1>
      </header>
      <div className="ai-character-viewer">
        <img
          ref={imgRef}
          id="ai-character-image"
          src="https://www.ahful.app/images/char-mouth-closed.png"
          alt="WakuWaku"
        />
      </div>
      <p ref={statusRef} id="ai-status">
        Ask me something!
      </p>
      <div className="ai-response-history" ref={responsesContainerRef}>
        {responses.length === 0 ? (
          <p className="ai-no-responses">No responses yet. Start chatting!</p>
        ) : (
          responses.map(response => (
            <div key={response.id} className="ai-response-box">
              <p className="ai-response-text">{response.text}</p>
              <button
                className="ai-delete-button"
                onClick={() => handleDeleteResponse(response.id)}
                title="Delete this response"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      <footer className="ai-chat-input-area">
        <select ref={voiceRef} id="ai-voice-select"></select>
        <textarea
          ref={textRef}
          id="ai-text-input"
          placeholder="Ask me anything..."
        />
        <button ref={sendRef} id="ai-send-button">
          <svg
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24px"
            height="24px"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </footer>
    </div>
  );
}
