import styles from './styles.scss';

const template = document.createElement('template');
template.innerHTML = `
  <style>${styles.toString()}</style>
  <div><slot></slot></div>
`;

class ChatMessage extends HTMLElement {
  constructor() {
    super();
    // Add a shadow DOM
    const shadowDOM = this.attachShadow({ mode: 'open' });
    // Render the template
    shadowDOM.appendChild(template.content.cloneNode(true));
  }
  
  static get observedAttributes() {
    return ['msgType'];
  }
  connectedCallback() {
    const msgType = this.getAttribute('msgType');
    if(msgType) {
        const div = this.shadowRoot.querySelector('div');
        div.setAttribute('class', msgType);
    }
  }
  
}

export default ChatMessage;
