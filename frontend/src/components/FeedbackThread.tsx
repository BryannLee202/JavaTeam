import { useState } from "react";

type Message = {
    id: number;
    sender: "Mentor";
    content: string;
    time: string;
    date: string;
};

type Props = {
    teamName: string;
    messages: Message[];
    onSend: (content: string) => void;
};

function FeedbackThread({
    teamName,
    messages,
    onSend,
}: Props) {
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        const content = newMessage.trim();

        if (!content) {
            return;
        }

        onSend(content);
        setNewMessage("");
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="feedback-chat">
            <div className="feedback-chat-header">
                <div className="feedback-chat-icon">
                    💬
                </div>

                <div>
                    <h3>Feedback</h3>
                    <p>
                        Conversation with{" "}
                        <strong>{teamName}</strong>
                    </p>
                </div>
            </div>

            <div className="feedback-chat-body">
                {messages.length === 0 ? (
                    <div className="feedback-empty">
                        <div className="feedback-empty-icon">
                            💬
                        </div>

                        <h4>No feedback yet</h4>

                        <p>
                            Send feedback to {teamName} to start
                            the conversation.
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => {
    const previousMessage =
        index > 0 ? messages[index - 1] : null;

    const showDate =
        !previousMessage ||
        previousMessage.date !== message.date;

    return (
        <div key={message.id}>
            {showDate && (
                <div className="feedback-date-divider">
                    <span>{message.date}</span>
                </div>
            )}

            <div className="feedback-row mentor-message">
                <div className="feedback-avatar">
                    M
                </div>

                <div className="feedback-message-content">
                    <span className="feedback-sender">
                        Mentor
                    </span>

                    <div className="feedback-bubble">
                        {message.content}
                    </div>

                    <span className="feedback-time">
                        {message.time}
                    </span>
                </div>
            </div>
        </div>
    );
})
                    
                )}
            </div>

            <div className="feedback-compose">
                <input
                    type="text"
                    placeholder={`Write feedback to ${teamName}...`}
                    value={newMessage}
                    onChange={(e) =>
                        setNewMessage(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="feedback-send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                >
                    Send ➤
                </button>
            </div>
        </div>
    );
}

export default FeedbackThread;