import { html, LitElement, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('input-with-keyboard')
export class InputWithKeyboard extends LitElement {
  @property({ type: String, reflect: true })
  currentValue = '';

  @query('#inputField')
  private inputField!: HTMLInputElement;

  @query('#keyboard')
  private keyboard!: HTMLDivElement;

  @state()
  private isKeyboardVisible = false;

  @state()
  private showNumbers = false;

  @state()
  private keyboardPosition: 'top' | 'bottom' = 'bottom';

  private default = [
    '1 2 3 4 5 6 7 8 9 0',
    'q w e r t y u i o p',
    'a s d f g h j k l',
    '{shift} z x c v b n m {backspace}',
    '{numbers} {space} {ent}',
  ];

  setInputStyle(height: string, width: string) {
    if (this.inputField) {
      this.inputField.style.width = width;
      this.inputField.style.height = height;
    }
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }

    input {
      width: 100%;
      padding: 8px;
      font-size: 1rem;
    }

    .keyboard-container {
      position: fixed;
      background: lightgrey;
      border: 1px solid black;
      padding: 8px 10px;
      display: none;
      z-index: 1000;
      width: auto;
      height: fit-content;
      flex-direction: column;
      gap: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    }

    .keyboard-container.visible {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    .keyboard-container.position-top {
      transform-origin: bottom center;
    }

    .keyboard-container.position-bottom {
      transform-origin: top center;
    }

    .keyboard-row {
      display: flex;
      justify-content: center;
      margin: 0;
      user-select: none;
      width: 100%;
      gap: 4px;
    }

    .key {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5em;
      height: 2.8em;
      padding: 0 10px;
      cursor: pointer;
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 6px;
      user-select: none;
      transition: background-color 0.2s;
      font-size: 1rem;
      flex: 0 0 auto;
    }

    .key.special {
      background-color: #e0e0e0;
      width: auto;
      min-width: 4em;
      font-size: 0.9rem;
      flex: 0 0 auto;
    }

    .key.space {
      width: auto;
      min-width: 8em;
      flex: 0 0 8em;
    }

    .key:hover {
      background-color: #f0f0f0;
    }

    .key:active {
      background-color: #e0e0e0;
    }

    @media (max-width: 600px) {
      .keyboard-container {
        width: 100%;
        left: 0 !important;
        right: 0 !important;
        padding: 6px 8px;
        gap: 3px;
      }

      .keyboard-row {
        gap: 3px;
      }

      .key {
        width: 2em;
        height: 2.4em;
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
    }

    @media (max-width: 412px) {
      .keyboard-container {
        padding: 4px 6px;
        gap: 2px;
      }

      .keyboard-row {
        gap: 2px;
      }

      .key {
        width: 1.8em;
        height: 2.2em;
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

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);

    // Notify Java code that the inputField is ready
    this.dispatchEvent(
      new CustomEvent('input-field-ready', {
        detail: { element: this.inputField },
        bubbles: true,
        composed: true,
      })
    );
  }

  private documentClickListener = this.handleDocumentClick.bind(this);
  private resizeObserver: ResizeObserver;

  constructor() {
    super();
    this.resizeObserver = new ResizeObserver(() => {
      if (this.isKeyboardVisible) {
        this.updateKeyboardPosition();
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.documentClickListener);
    window.addEventListener('scroll', this.updateKeyboardPosition.bind(this), true);
    window.addEventListener('resize', this.updateKeyboardPosition.bind(this));
    if (this.keyboard) {
      this.resizeObserver.observe(this.keyboard);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.documentClickListener);
    window.removeEventListener('scroll', this.updateKeyboardPosition.bind(this));
    window.removeEventListener('resize', this.updateKeyboardPosition.bind(this));
    this.resizeObserver.disconnect();
  }

  render() {
    return html`
      <input
        id="inputField"
        .value="${this.currentValue}"
        @input="${this.handleInput}"
        @focus="${this.showKeyboard}" />
      <div id="keyboard" class="keyboard-container ${this.isKeyboardVisible ? 'visible' : ''}">
        ${this.default.map(
          (row) => html`<div class="keyboard-row">${row.split(' ').map((key) => this.renderKey(key))}</div>`
        )}
      </div>
    `;
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const newValue = target.value;
    this.updateValue(newValue);
  }

  private updateKeyboardPosition() {
    if (!this.keyboard || !this.inputField || !this.isKeyboardVisible) return;

    const inputFieldRect = this.inputField.getBoundingClientRect();
    const keyboardHeight = this.keyboard.offsetHeight;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - inputFieldRect.bottom;
    const spaceAbove = inputFieldRect.top;

    // Calculate available space for keyboard
    const minSpaceNeeded = 200; // Minimum space needed for keyboard
    const hasSpaceBelow = spaceBelow >= minSpaceNeeded;
    const hasSpaceAbove = spaceAbove >= minSpaceNeeded;

    // Determine position based on available space
    if (hasSpaceBelow) {
      this.keyboardPosition = 'bottom';
      this.keyboard.style.top = `${inputFieldRect.bottom}px`;
      this.keyboard.style.bottom = 'auto';
    } else if (hasSpaceAbove) {
      this.keyboardPosition = 'top';
      this.keyboard.style.bottom = `${windowHeight - inputFieldRect.top}px`;
      this.keyboard.style.top = 'auto';
    } else {
      // If there's not enough space above or below, position at bottom of viewport
      this.keyboardPosition = 'bottom';
      this.keyboard.style.bottom = '0';
      this.keyboard.style.top = 'auto';
    }

    // Handle horizontal positioning
    if (window.innerWidth <= 600) {
      // On mobile, keyboard spans full width
      this.keyboard.style.left = '0';
      this.keyboard.style.right = '0';
    } else {
      // On desktop, align with input field
      const keyboardWidth = this.keyboard.offsetWidth;
      let left = inputFieldRect.left;

      if (left + keyboardWidth > window.innerWidth) {
        left = window.innerWidth - keyboardWidth - 10;
      }

      // Prevent keyboard from extending past left edge
      left = Math.max(10, left);

      this.keyboard.style.left = `${left}px`;
    }

    // Ensure keyboard is visible within viewport
    requestAnimationFrame(() => {
      const keyboardRect = this.keyboard.getBoundingClientRect();
      if (keyboardRect.bottom > windowHeight) {
        this.keyboard.style.bottom = '0';
        this.keyboard.style.top = 'auto';
      }
    });
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
    return this.inputField?.selectionStart ?? this.currentValue.length;
  }

  private setCursorPosition(position: number) {
    if (this.inputField) {
      requestAnimationFrame(() => {
        this.inputField.setSelectionRange(position, position);
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
      requestAnimationFrame(() => {
        this.updateKeyboardPosition();
      });
    }
  }

  private handleDocumentClick(event: MouseEvent) {
    if (!this.isKeyboardVisible) return;

    const path = event.composedPath();
    const isKeyboardClick = path.includes(this.keyboard);
    const isTextFieldClick = path.includes(this.inputField);

    if (!isKeyboardClick && !isTextFieldClick) {
      this.isKeyboardVisible = false;
    }
  }
}
