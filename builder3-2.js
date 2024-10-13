(function () {
    let template = document.createElement("template");
    template.innerHTML = `
<br>
<style>
    #form {
        font-family: Arial, sans-serif;
        width: 400px;
        margin: 0 auto;
    }

    a {
        text-decoration: none;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
    }

    td {
        padding: 1px;
        text-align: left;
        font-size: 13px;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 2px solid #ccc;
        border-radius: 5px;
        font-size: 13px;
        box-sizing: border-box;
        margin-bottom: 10px;
    }

    input[type="submit"] {
        background-color: #487cac;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
    }
</style>
<form id="form">
    <table>
        <tr>
            <td>
                <p>Api Key of ChatGPT</p>
                <input id="builder_apiKey" type="text" placeholder="Enter Api Key of ChatGPT">
            </td>
        </tr>
        <tr>
            <td>
                <p>Result Max Length</p>
                <input id="builder_max_tokens" type="number" placeholder="Enter Result Max Length">
            </td>
        </tr>
    </table>
    <input value="Update Settings" type="submit">
</form>
`;

    class ChatGptWidgetBuilderPanel extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            // Add event listener to form submit
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        }

        // Submit event that dispatches the updated properties
        _submit(e) {
            e.preventDefault();

            // Dispatch the propertiesChanged event with updated API key and max_tokens
            this.dispatchEvent(
                new CustomEvent("propertiesChanged", {
                    detail: {
                        properties: {
                            apiKey: this.apiKey,
                            max_tokens: this.max_tokens
                        },
                    },
                })
            );
        }

        // Getter and setter for the apiKey property
        set apiKey(apiKey) {
            this._shadowRoot.getElementById("builder_apiKey").value = apiKey;
        }
        get apiKey() {
            return this._shadowRoot.getElementById("builder_apiKey").value;
        }

        // Getter and setter for the max_tokens property
        set max_tokens(max_tokens) {
            this._shadowRoot.getElementById("builder_max_tokens").value = max_tokens;
        }
        get max_tokens() {
            return this._shadowRoot.getElementById("builder_max_tokens").value;
        }
    }

    customElements.define("chatbot-widget-builder", ChatGptWidgetBuilderPanel);
})();
