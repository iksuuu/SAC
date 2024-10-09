(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
      #chatWindow {
        width: 100%;
        height: 300px;
        border: 1px solid #ccc;
        overflow-y: auto;
        padding: 5px;
        background-color: #f9f9f9;
      }
      #userInput {
        width: calc(100% - 60px);
        margin-right: 10px;
      }
      #sendBtn {
        width: 50px;
      }
    </style>
    <div>
      <div id="chatWindow"></div>
      <input type="text" id="userInput" placeholder="Type your message here..."/>
      <button type="button" id="sendBtn">Send</button>
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
            messageElement.textContent = `${sender}: ${message}`;
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

        fireChanged() {
            console.log("OnClick Triggered");
        }
    }

    customElements.define('chatbot-widget', ChatbotWidget);
})();
