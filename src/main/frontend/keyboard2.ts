import { html, LitElement, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field';

@customElement('input-with-keyboard')
export class InputWithKeyboard extends LitElement {
    @property({ type: String })
    currentValue = '';

    @query('#textField')
    private textField!: TextField;

    @query('#keyboard')
    private keyboard!: HTMLDivElement;

    @state()
    private isKeyboardVisible = false;

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
            max-width: 600px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .keyboard-container.visible {
            display: flex;
        }

        .key {
            display: inline-block;
            margin: 5px;
            padding: 10px 15px;
            cursor: pointer;
            background-color: #ffffff;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 4px;
            user-select: none;
            transition: background-color 0.2s;
        }

        .key:hover {
            background-color: #f0f0f0;
        }

        .key:active {
            background-color: #e0e0e0;
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

    render() {
        return html`
            <vaadin-text-field
                id="textField"
                .value="${this.currentValue}"
                @input="${this.handleInput}"
                @focus="${this.showKeyboard}"
            ></vaadin-text-field>
            <div id="keyboard" class="keyboard-container ${this.isKeyboardVisible ? 'visible' : ''}">
                ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => html`
                    <div
                        class="key"
                        @mousedown="${(e: MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.addCharacter(letter);
                        }}"
                    >${letter}</div>
                `)}
            </div>
        `;
    }

    private handleInput(e: Event) {
        const target = e.target as TextField;
        const newValue = target.value;
        this.updateValue(newValue);
    }

    private updateValue(newValue: string) {
        this.currentValue = newValue;
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.currentValue },
            bubbles: true,
            composed: true
        }));
    }

    private addCharacter(character: string) {
        // Get the current cursor position
        const cursorPos = this.textField.inputElement?.selectionStart ?? this.currentValue.length;

        // Insert the character at the cursor position
        const newValue = this.currentValue.slice(0, cursorPos) + character + this.currentValue.slice(cursorPos);

        this.updateValue(newValue);

        // Update the text field value and cursor position
        this.textField.value = newValue;

        // Set the cursor position after the inserted character
        requestAnimationFrame(() => {
            const newPos = cursorPos + 1;
            this.textField.inputElement?.setSelectionRange(newPos, newPos);
        });
    }

    private showKeyboard() {
        if (!this.isKeyboardVisible) {
            this.isKeyboardVisible = true;
            this.updateKeyboardPosition();
        }
    }

    private updateKeyboardPosition() {
        if (this.keyboard && this.textField) {
            const textFieldRect = this.textField.getBoundingClientRect();
            this.keyboard.style.top = `${textFieldRect.bottom + 5}px`;
            this.keyboard.style.left = `${textFieldRect.left}px`;
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