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
        text-align: left;
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
            this._apiKey = ''; // Initialize an empty apiKey
            this._max_tokens = 200; // Initialize max_tokens
            this.conversationHistory = [];  // Initialize memory to store conversation history
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
                // Store the user's message in the conversation history
                this.conversationHistory.push({ role: "user", content: message });
                // Send the conversation history to OpenAI API
                this.sendMessage();
            }
        }

        displayMessage(sender, message, messageElement=null) {
            if (!messageElement) {
              messageElement = document.createElement('div');
              messageElement.classList.add('message');
              this.chatWindow.appendChild(messageElement);
          }

            messageElement.textContent = `${sender}: ${message}`;

            if (sender === "User") {
                messageElement.classList.add('user-message');
            } else {
                messageElement.classList.add('bot-message');
            }

            this.chatWindow.scrollTop = this.chatWindow.scrollHeight; // Auto scroll

            return messageElement;
        }

        async sendMessage(message) {
            console.log(`Sending message: ${message}`);
            if (this.conversationHistory.length > 10) 
              {  // Keep only the last 10 messages
              this.conversationHistory = this.conversationHistory.slice(-10);
            }
          
            // Display a "loading" message or spinner (optional)
            const typingElement = this.displayMessage("Bot", "Typing...");
            
            console.log('API Key being used:', this._apiKey);
            console.log('Max tokens being used:', this._max_tokens);

            // Check if the API key is set
            if (!this._apiKey) {
                this.displayMessage("Bot", "API key is missing!", typingElement);
                return;
            }

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this._apiKey}`  // Authenticate the API request
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",  // Specify the model
                        messages: this.conversationHistory,  // Send the conversation history
                        max_tokens: this._max_tokens // Limit the number of tokens generated
                    })
                });

                const data = await response.json();
                // Parse the API response and display it
                const botReply = data.choices[0].message.content.trim();

                // Store the bot's response in the conversation history
                this.conversationHistory.push({ role: "assistant", content: botReply });

                // Replace "Typing..." with the bot's actual response
                this.displayMessage("Bot", botReply, typingElement);
                
            } catch (error) {
                console.error('Error with OpenAI API request:', error);
                this.displayMessage("Bot", "Sorry, there was an error. Please try again.", typingElement);
            }
        }
        // Setters for properties to be called by the SAC framework
        set apiKey(value) {
          this._apiKey = value;
        }

        set max_tokens(value) {
          this._max_tokens = value;
        }

        get apiKey() {
          return this._apiKey;
        }

        get max_tokens() {
          return this._max_tokens;
        }
    }

    customElements.define('chatbot-widget', ChatbotWidget);
})();
