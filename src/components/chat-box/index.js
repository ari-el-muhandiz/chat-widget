import styles from './styles.scss';
import { fetchToken, initChannel, getMessages} from '../../lib/chat'

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <div class="chat-box">
    <div class="chat-head">
        <h2>Chat Box</h2>
    </div>
    <div class="chat-body">
      <div class="msg-insert">
        <slot></slot>
      </div>
    </div>
    <div class="chat-text">
      <textarea placeholder="Send"></textarea>
    </div>
  </div>
`;

class ChatBox extends HTMLElement {
   constructor() {
    super();
    // Add a shadow DOM
    const shadowDOM = this.attachShadow({ mode: 'open' });   

    // Render the template in the shadow dom
    shadowDOM.appendChild(template.content.cloneNode(true));

    // Method binding
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessageToList = this.addMessageToList.bind(this);
    this.channel = null;
  }

    // Called when the element is added to the DOM
    connectedCallback() {
        const textArea = this.shadowRoot.querySelector('textArea');
        textArea.disabled = true;
        textArea.onkeypress = this.sendMessage;
        fetchToken().then((data) => {
            return data.json()
        }).then((resp) => {
            const { token } = resp;
            return initChannel(token);
        }).then((channel) => {
            channel.on('messageAdded', this.addMessageToList);
            this.channel = channel;
            textArea.disabled = false;
            return getMessages(channel);
        }).then((messages) => {
            const totalMessages = messages.items.length;
            for (let i = 0; i < totalMessages; i++) {
              const message = messages.items[i];
              this.addMessageToList(message);
             }
        });
  }
  
  sendMessage(e) {
    if (e.keyCode === 13) {
        e.preventDefault
        // Get the input
        const textArea = this.shadowRoot.querySelector('textArea');
        this.channel.sendMessage(textArea.value);
        textArea.value = '';
    }
      
  }

  addMessageToList(message) {
    const item = document.createElement('chat-message');
    item.innerHTML = message.body;
    item.setAttribute('msgType', message.author === 'admin' ? 'msg-receive' : 'msg-send');
    // Add it to the light DOM
    this.appendChild(item);
  }

}

export default ChatBox;