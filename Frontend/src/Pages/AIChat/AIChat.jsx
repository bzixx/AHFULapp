import "./AIChat.css";
import "../../SiteStyles.css";
import { Chat } from "../../components/CompanionAI/Chat"

export function AIChat() {
    return (
        <div className="ai-chat-page">
            <h1>AI Chat</h1>
            <Chat />
        </div>
    );
}

