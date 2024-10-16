(function () {
  let template = document.createElement("template");
  template.innerHTML = `
      <style>
        :host {}

        div {
          margin: 50px auto;
          max-width: 600px;
        }

        .input-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        #prompt-input {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 70%;
        }

        #generate-button {
          padding: 10px;
          font-size: 16px;
          background-color: #3cb6a9;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 25%;
        }

        #generated-text {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 96%;
        }

        @media (max-width: 768px) {
          div {
            max-width: 100%;
            margin: 20px;
          }
        }
      </style>
      <div>
        <center>
          <img src="https://1000logos.net/wp-content/uploads/2023/02/ChatGPT-Emblem.png" width="200"/>
          <h1>ChatGPT</h1>
        </center>
        <div class="input-container">
          <input type="text" id="prompt-input" placeholder="Enter a prompt">
          <button id="generate-button">Generate Text</button>
        </div>
        <textarea id="generated-text" rows="10" cols="50" readonly></textarea>
      </div>
    `;

  class Widget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }

    async connectedCallback() {
      this.initMain();
    }

    async initMain() {
      const generatedText = this.shadowRoot.getElementById("generated-text");
      generatedText.value = "";
      const { apiKey } = this._props || {};
      const { max_tokens, model, temperature } = this._props || {};
      const generateButton = this.shadowRoot.getElementById("generate-button");
      
      generateButton.addEventListener("click", async () => {
        const promptInput = this.shadowRoot.getElementById("prompt-input");
        const prompt = promptInput.value;

        if (!apiKey) {
          generatedText.value = "API Key is missing!";
          return;
        }

        generatedText.value = "Finding result...";

        try {
          const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify({
              model: model || "text-davinci-002",
              prompt: prompt,
              max_tokens: parseInt(max_tokens) || 1024,
              temperature: parseFloat(temperature) || 0.5,
            })
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const { choices } = await response.json();
          const generatedTextValue = choices[0].text;
          generatedText.value = generatedTextValue.replace(/^\n+/, '');
        } catch (error) {
          generatedText.value = "Error: " + error.message;
        }
      });
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.initMain();
    }
  }

  customElements.define("com-rohitchouhan-sap-chatgptwidget", Widget);
})();
