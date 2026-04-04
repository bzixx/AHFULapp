import "./Chat.css"

export function Chat(){

    return(
        <div class="chat-container">
        <header class="chat-header">
            <h1>AI Companion</h1>
        </header>
        <div class="character-viewer">
            <img id="character-image" src="../../../images/char-mouth-closed.png" alt="WakuWaku"></img>
        </div>
        <p id="status">Ask me something!</p>
        <footer class="chat-input-area">
            <select id="voice-select"></select>
            <textarea id="text-input" placeholder="Ask me anything..."></textarea>
            <button id="send-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </footer>
    </div>
    )
    
}