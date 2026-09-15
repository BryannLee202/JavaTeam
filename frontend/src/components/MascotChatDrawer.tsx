import React, { useState, useRef, useEffect } from "react";
import { MascotBot } from "./MascotBot";
import { aiApi } from "../api/aiApi";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "BR-01: Quy mô đội thi",
  "BR-02: Nộp muộn trừ điểm",
  "BR-03: Xung đột lợi ích",
  "BR-04: Trọng số tiêu chí",
  "BR-06: Xuất bảng điểm CSV",
];

export function MascotChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào! Mình là SEAL Bot 🤖 — Trợ lý ảo thông minh của SEAL Hackathon. Bạn có thắc mắc gì về quy chế, tiêu chí chấm hay thể lệ cuộc thi không?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend?: string) {
    const text = (textToSend ?? input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const reply = await aiApi.askMascot(text);
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: "bot-err-" + Date.now(),
        sender: "bot",
        text: "Xin lỗi, hiện tại bot đang bận một chút. Bạn vui lòng thử lại sau nhé!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <aside
      role="region"
      aria-label="SEAL Bot Assistant"
      style={{ position: "fixed", bottom: 20, right: 24, zIndex: 9999 }}
    >
      {/* Nút bấm mở Mascot */}
      {!isOpen && (
        <button
          type="button"
          aria-label="Mở Trợ lý SEAL Bot"
          onClick={() => setIsOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px 8px 8px",
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            color: "#ffffff",
            borderRadius: 9999,
            border: "none",
            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13.5,
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MascotBot size={34} />
          </div>
          <span>Hỏi thể lệ AI</span>
        </button>
      )}

      {/* Cửa sổ Chat Drawer */}
      {isOpen && (
        <div
          style={{
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            height: 480,
            maxHeight: "calc(100vh - 100px)",
            background: "var(--color-surface, #ffffff)",
            borderRadius: 16,
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.2)",
            border: "1px solid var(--color-border, #e2e8f0)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36 }}>
                <MascotBot size={32} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>SEAL Bot</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>Trợ lý ảo Thể lệ Hackathon</div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng Trợ lý SEAL Bot"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: 18,
                cursor: "pointer",
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>

          {/* Body tin nhắn */}
          <div
            style={{
              flex: 1,
              padding: 14,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "var(--color-bg, #f8fafc)",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "84%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  background: m.sender === "user" ? "var(--color-primary, #2563eb)" : "var(--color-surface, #ffffff)",
                  color: m.sender === "user" ? "#ffffff" : "var(--color-text, #1e293b)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  border: m.sender === "user" ? "none" : "1px solid var(--color-border, #e2e8f0)",
                }}
              >
                {m.text}
                <div
                  style={{
                    fontSize: 10,
                    opacity: 0.6,
                    marginTop: 4,
                    textAlign: m.sender === "user" ? "right" : "left",
                  }}
                >
                  {m.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: "var(--color-surface, #ffffff)",
                  color: "var(--color-text-muted, #64748b)",
                  border: "1px solid var(--color-border, #e2e8f0)",
                }}
              >
                SEAL Bot đang trả lời...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              background: "var(--color-surface, #ffffff)",
              borderTop: "1px solid var(--color-border, #e2e8f0)",
              whiteSpace: "nowrap",
            }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 9999,
                  fontSize: 11,
                  border: "1px solid var(--color-border, #cbd5e1)",
                  background: "var(--color-bg, #f1f5f9)",
                  color: "var(--color-text, #334155)",
                  cursor: "pointer",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Ô nhập & Nút gửi */}
          <div
            style={{
              padding: "10px 12px",
              display: "flex",
              gap: 8,
              background: "var(--color-surface, #ffffff)",
              borderTop: "1px solid var(--color-border, #e2e8f0)",
            }}
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi thể lệ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--color-border, #cbd5e1)",
                fontSize: 13,
                outline: "none",
                background: "var(--color-bg, #ffffff)",
                color: "var(--color-text, inherit)",
              }}
            />
            <button
              type="button"
              className="btn small primary"
              onClick={() => handleSend()}
              disabled={!input.trim()}
              style={{ padding: "0 14px" }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
