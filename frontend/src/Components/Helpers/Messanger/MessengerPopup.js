import React, { useState, useEffect, useRef, useContext } from "react";
import Popup from "../../Helpers/PopUp/PopUp.js";
import "./MessengerPopup.css";
import { fetchMessages, sendMessage } from "./Functions/messagingFunctions.js";
import { IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import { AuthContext } from "../../Auth&Verify/UserAuth.js";
import { v4 as uuidv4 } from "uuid"; 

const MessengerPopup = ({ order, onClose, setSessionExpired }) => {
  const { userInfo } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);
  const sentMessageIds = useRef(new Set()); 
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(order.id, setSessionExpired);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    if (!ws.current) {
      ws.current = new WebSocket(`ws://localhost:8000/chat/${order.id}`);

      ws.current.onmessage = async (e) => {
        try {
          let data;
          if (e.data instanceof Blob) {
            const text = await e.data.text();
            data = JSON.parse(text);
          } else {
            data = JSON.parse(e.data);
          }

          if (!messages.some((msg) => msg.id === data.id) && !sentMessageIds.current.has(data.id)) {
            setMessages((prevMessages) => [...prevMessages, data]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        ws.current = null;
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [order.id, setSessionExpired]);


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: uuidv4(),
      orderId: order.id,
      sender: userInfo.isAdmin ? "admin" : "user",
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      sentMessageIds.current.add(messageData.id);

      await sendMessage(order.id, messageData.sender, newMessage, setSessionExpired);

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(messageData));
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      sentMessageIds.current.delete(messageData.id);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IL", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jerusalem",
    });
  };

  const getMessageAlignment = (msg) => {
    return (msg.sender === "admin" && userInfo.isAdmin) || (msg.sender === "user" && !userInfo.isAdmin)
      ? "current-sender"
      : "receiver";
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Popup onClose={onClose} isX={true} title={`Messenger for Order ${order.token}`} buttonText="Close">
      <div className="messenger-container">
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          <div className="messages-list">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={msg.id || index} className={`message-container ${getMessageAlignment(msg)}`}>
                  <div className={`message ${getMessageAlignment(msg)}`}>
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{formatDate(msg.timestamp)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No messages yet. Start the conversation!</p>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <div className="message-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
          />
          <IconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()} style={{ marginTop: "0" }}>
            <Send />
          </IconButton>
        </div>
      </div>
    </Popup>
  );
};

export default MessengerPopup;