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
        max-width: 700px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        background-color: #f4f4f4; /* Fiori-like background */
        font-family: "72", Arial, sans-serif;
      }
      
      /* Chat window styles */
      #chatWindow {
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #ffffff;
        border-bottom: 1px solid #ddd;
      }

      /* Message bubble styles */
      .message {
        margin: 8px;
        padding: 10px;
        border-radius: 8px;
        max-width: 70%;
        white-space: pre-wrap;
        font-size: 14px;
      }

      /* User message styles */
      .user-message {
        background-color: #006BB4; /* Fiori blue */
        color: white;
        align-self: flex-end;

      }

      /* Bot message styles */
      .bot-message {
        background-color: #E5E5E5; /* Light gray for bot */
        color: #000000;
        align-self: flex-start;
      }

      /* Input and button container */
      .input-container {
        display: flex;
        padding: 10px;
        background-color: #ffffff;
      }

      /* Input styles */
      #userInput {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-family: "72", Arial, sans-serif;
        font-size: 14px;
      }

      /* Send button styles */
      #sendBtn {
        margin-left: 10px;
        padding: 10px 20px;
        background-color: #0A6ED1; /* Fiori button blue */
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        font-family: "72", Arial, sans-serif;
      }

      /* Hover effects */
      #sendBtn:hover {
        background-color: #004C99; /* Darker blue on hover */
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
            this._props = {};  // Initialize _props to hold all widget properties
            this.conversationHistory = [];  // Initialize memory to store conversation history
            this.init();
        }

        init() {

            // Check if shadow DOM is already attached to avoid re-attachment
            if (!this.shadowRoot) {
              let shadowRoot = this.attachShadow({ mode: "open" });
              shadowRoot.appendChild(tmpl.content.cloneNode(true));

              this.chatWindow = shadowRoot.querySelector('#chatWindow');
              this.userInput = shadowRoot.querySelector('#userInput');
              this.sendBtn = shadowRoot.querySelector('#sendBtn');

              // Add event listener for "click" on the send button
              this.sendBtn.addEventListener('click', () => this.handleSendMessage());

              // Add event listener for "Enter" key press
              this.userInput.addEventListener('keydown', (event) => {
                  if (event.key === 'Enter') {
                      this.handleSendMessage();
                      event.preventDefault();  // Prevent default "Enter" behavior (e.g., form submission)
                  }
              });
            }
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

            // Replace newline characters with <br> tags for proper formatting
            const formattedMessage = message.replace(/\n/g, '<br>');
            // Set the formatted message as the content of the messageElement
            messageElement.innerHTML = `${sender}: ${formattedMessage}`;

            //messageElement.textContent = `${sender}: ${message}`;

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
            
            /*
            const apiKey = this._props.apiKey ? this._props.apiKey.trim() : '';
            const max_tokens = this._props.max_tokens || 1024;
            console.log('API Key being used:', apiKey);
            console.log('Max tokens being used:', max_tokens);

            // Check if the API key is set
            if (!apiKey) {
                this.displayMessage("Bot", "API key is missing!", typingElement);
                return;
            }
            */

            const apiUrl = 'https://sql-agent-purchaseorder-repl-fastapi-chipper-meerkat-ix.cfapps.eu10-004.hana.ondemand.com/ask';

            try {
                // Convert the conversationHistory array to a string using JSON.stringify
                const conversationText = JSON.stringify(this.conversationHistory);
                
                // Send the conversation history as the 'question' in the request body
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: conversationText // Send the stringified conversation history to the API
                    })
                });

                const data = await response.json();
                // Parse the API response and display it
                const botReply = data.response.trim();

                // Store the bot's response in the conversation history
                this.conversationHistory.push({ role: "assistant", content: botReply });

                // Replace "Typing..." with the bot's actual response
                this.displayMessage("Bot", botReply, typingElement);
                
            } catch (error) {
                console.error('Error with OpenAI API request:', error);
                this.displayMessage("Bot", "Sorry, there was an error. Please try again. ${error}", typingElement);
            }
        }
        /*
        // Method to handle incoming property changes from SAC
        onCustomWidgetBeforeUpdate(changedProperties) {
          this._props = { ...this._props, ...changedProperties };
        }

        // Method to re-initialize the widget after property updates
        onCustomWidgetAfterUpdate(changedProperties) {
            this.init();
        }
        */
    }

    customElements.define('chatbot-widget-fastapi', ChatbotWidget);
})();
