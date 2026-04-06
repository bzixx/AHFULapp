import "./CompanionAI.css"
import "./CompanionAI.js"

export function CompanionAI(){

    useEffect(() => {
        populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }
    }, []); // Empty array = runs once on mount

    return(
        <div class="ai-chat-container">
        <header class="ai-chat-header">
            <h1>AI Companion</h1>
        </header>
        <div class="ai-character-viewer">
            <img id="ai-character-image" src="../../../images/char-mouth-closed.png" alt="WakuWaku"></img>
        </div>
        <p id="ai-status">Ask me something!</p>
        <footer class="ai-chat-input-area">
            <select id="ai-voice-select"></select>
            <textarea 
            id="ai-text-input" 
            placeholder="Ask me anything..." 
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
                }
            }}
            ></textarea>
            <button id="ai-send-button" onClick={handleSendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </footer>
    </div>
    )
    
}