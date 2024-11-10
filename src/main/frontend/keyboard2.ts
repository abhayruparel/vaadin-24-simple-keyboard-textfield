import { html, LitElement, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field';

@customElement('input-with-keyboard')
export class InputWithKeyboard extends LitElement {
  @property({ type: String, reflect: true })
  currentValue = '';

  @query('#textField')
  private textField!: TextField;

  @query('#keyboard')
  private keyboard!: HTMLDivElement;

  @state()
  private isKeyboardVisible = false;

  @state()
  private showNumbers = false;

  private default = [
    '1 2 3 4 5 6 7 8 9 0',
    'q w e r t y u i o p',
    'a s d f g h j k l',
    '{shift} z x c v b n m {backspace}',
    '{numbers} {space} {ent}',
  ];

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .keyboard-container {
      position: fixed;
      background: lightgrey;
      border: 1px solid black;
      padding: 10px;
      display: none;
      z-index: 1000;
      flex-wrap: wrap;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40%;
      max-height: 500px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .keyboard-container.visible {
      display: flex;
    }

    .keyboard-row {
      display: flex;
      justify-content: center;
      margin: 0;
      user-select: none;
      width: 100%;
      margin-right: 1em;
    }

    .key {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5em; /* Fixed width for letter keys */
      height: 3em;
      margin: 3px;
      padding: 0 10px;
      cursor: pointer;
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 6px;
      user-select: none;
      transition: background-color 0.2s;
      font-size: 1rem;
      flex: 0 0 auto; /* Prevent flex growing */
    }

    .key.special {
      background-color: #e0e0e0;
      width: auto; /* Allow special keys to size based on content */
      min-width: 4em;
      font-size: 0.9rem;
      flex: 0 0 auto;
    }

    .key.space {
      width: auto;
      min-width: 8em;
      flex: 0 0 8em; /* Fixed width for space */
    }

    .key:hover {
      background-color: #f0f0f0;
    }

    .key:active {
      background-color: #e0e0e0;
    }

    @media (max-width: 600px) {
      .key {
        width: 2em; /* Slightly smaller on mobile */
        height: 2.5em;
        margin: 2px;
        padding: 0 5px;
        font-size: 0.9rem;
      }

      .key.special {
        min-width: 3.5em;
      }

      .key.space {
        min-width: 6em;
        flex: 0 0 6em;
      }

      .keyboard-row {
        justify-content: center;
        padding: 0 5px;
      }
    }

    @media (max-width: 412px) {
      .keyboard-container {
        padding: 5px;
      }

      .key {
        width: 1.8em; /* Even smaller on very small screens */
        font-size: 0.8rem;
        padding: 0 3px;
      }

      .key.special {
        min-width: 3em;
      }

      .key.space {
        min-width: 5em;
        flex: 0 0 5em;
      }
    }
  `;

  private documentClickListener = this.handleDocumentClick.bind(this);

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.documentClickListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.documentClickListener);
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    if (changedProperties.has('currentValue')) {
      if (this.textField && this.textField.value !== this.currentValue) {
        this.textField.value = this.currentValue;
      }
    }
  }

  render() {
    return html`
      <vaadin-text-field
        id="textField"
        .value="${this.currentValue}"
        @input="${this.handleInput}"
        @focus="${this.showKeyboard}"></vaadin-text-field>
      <div id="keyboard" class="keyboard-container ${this.isKeyboardVisible ? 'visible' : ''}">
        ${this.default.map(
          (row) => html` <div class="keyboard-row">${row.split(' ').map((key) => this.renderKey(key))}</div> `
        )}
      </div>
    `;
  }

  private renderKey(key: string) {
    let label = key;
    let className = 'key';
    let handler = () => this.addCharacter(key);

    switch (key) {
      case '{backspace}':
        label = '⌫';
        className += ' special';
        handler = this.handleBackspace;
        break;
      case '{space}':
        label = 'space';
        className += ' space';
        handler = () => this.addCharacter(' ');
        break;
        case '{shift}':
        label = '⇧';
        // className +=' ';
        handler = () => {};
        break;
      case '{ent}':
        label = 'enter';
        className += ' special';
        handler = this.handleEnter;
        break;
      case '{numbers}':
        label = '123';
        className += ' special';
        handler = () => (this.showNumbers = true);
        break;
      case '{abc}':
        label = 'ABC';
        className += ' special';
        handler = () => (this.showNumbers = false);
        break;
    }

    return html`
      <div
        class="${className}"
        @mousedown="${(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          handler();
        }}">
        ${label}
      </div>
    `;
  }

  private handleBackspace = () => {
    const cursorPos = this.getCursorPosition();
    if (cursorPos > 0) {
      const newValue = this.currentValue.slice(0, cursorPos - 1) + this.currentValue.slice(cursorPos);
      this.updateValue(newValue);
      this.setCursorPosition(cursorPos - 1);
    }
  };

  private handleEnter = () => {
    this.dispatchEvent(
      new CustomEvent('keyboard-enter', {
        bubbles: true,
        composed: true,
      })
    );
    this.isKeyboardVisible = false;
  };

  private handleInput(e: Event) {
    const target = e.target as TextField;
    const newValue = target.value;
    this.updateValue(newValue);
  }

  private updateValue(newValue: string) {
    this.currentValue = newValue;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: this.currentValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private getCursorPosition(): number {
    const input = this.textField.inputElement as HTMLInputElement;
    return input?.selectionStart ?? this.currentValue.length;
  }

  private setCursorPosition(position: number) {
    const input = this.textField.inputElement as HTMLInputElement;
    if (input) {
      requestAnimationFrame(() => {
        input.setSelectionRange(position, position);
      });
    }
  }

  private addCharacter(character: string) {
    const cursorPos = this.getCursorPosition();
    const newValue = this.currentValue.slice(0, cursorPos) + character + this.currentValue.slice(cursorPos);
    this.updateValue(newValue);
    this.setCursorPosition(cursorPos + 1);
  }

  private showKeyboard() {
    if (!this.isKeyboardVisible) {
      this.isKeyboardVisible = true;
    }
  }

  private handleDocumentClick(event: MouseEvent) {
    if (!this.isKeyboardVisible) return;

    const path = event.composedPath();
    const isKeyboardClick = path.includes(this.keyboard);
    const isTextFieldClick = path.includes(this.textField);

    if (!isKeyboardClick && !isTextFieldClick) {
      this.isKeyboardVisible = false;
    }
  }
}
