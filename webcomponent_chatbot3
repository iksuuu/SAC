(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
      /* Container styles */
      .chat-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 400px;
        max-width: 400px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        background-color: #fff;
      }
      
      /* Chat window styles */
      #chatWindow {
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #f0f0f0;
        border-bottom: 1px solid #ddd;
        font-family: 'Arial', sans-serif;
      }

      /* Message bubble styles */
      .message {
        margin: 5px 0;
        padding: 8px 12px;
        border-radius: 15px;
        max-width: 80%;
        word-wrap: break-word;
      }

      /* User message styles */
      .user-message {
        background-color: #e0ffe0;
        align-self: flex-end;
        text-align: right;
      }

      /* Bot message styles */
      .bot-message {
        background-color: #f0f0f0;
        align-self: flex-start;
        text-align: left;
      }

      /* Input and button container */
      .input-container {
        display: flex;
        padding: 10px;
        background-color: #fff;
      }

      /* Input styles */
      #userInput {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-family: 'Arial', sans-serif;
      }

      /* Send button styles */
      #sendBtn {
        margin-left: 10px;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        font-family: 'Arial', sans-serif;
      }

      /* Hover effects */
      #sendBtn:hover {
        background-color: #0056b3;
      }

      /* Scrollbar styling */
      #chatWindow::-webkit-scrollbar {
        width: 8px;
      }
      #chatWindow::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 10px;
      }
    </style>

    <div class="chat-container">
      <div id="chatWindow"></div>
      <div class="input-container">
        <input type="text" id="userInput" placeholder="Type your message here..." />
        <button type="button" id="sendBtn">Send</button>
      </div>
    </div>`;

    class ChatbotWidget extends HTMLElement {
        constructor() {
            super();
            this.init();
        }

        init() {
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this.chatWindow = shadowRoot.querySelector('#chatWindow');
            this.userInput = shadowRoot.querySelector('#userInput');
            this.sendBtn = shadowRoot.querySelector('#sendBtn');

            this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        handleSendMessage() {
            const message = this.userInput.value;
            if (message.trim() !== "") {
                this.displayMessage("User", message);
                this.userInput.value = "";
                this.sendMessage(message);  // Placeholder function to implement
            }
        }

        displayMessage(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = message;

            if (sender === "User") {
                messageElement.classList.add('user-message');
            } else {
                messageElement.classList.add('bot-message');
            }

            this.chatWindow.appendChild(messageElement);
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight; // Auto scroll
        }

        sendMessage(message) {
            // Placeholder: Implement sending message to the backend (e.g., API call)
            console.log(`Sending message: ${message}`);
            // Simulate receiving a response
            setTimeout(() => this.receiveMessage("Bot", "This is a simulated response."), 1000);
        }

        receiveMessage(sender, message) {
            // Placeholder: Implement receiving messages from the backend
            this.displayMessage(sender, message);
        }
    }

    customElements.define('chatbot-widget', ChatbotWidget);
})();
