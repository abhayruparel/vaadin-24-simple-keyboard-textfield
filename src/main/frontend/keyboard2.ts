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

    private addCharacter(character: string) {
        this.currentValue += character;
        this.textField.value = this.currentValue;
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.currentValue },
            bubbles: true,
            composed: true
        }));
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
        // Don't process if keyboard isn't visible
        if (!this.isKeyboardVisible) return;

        const path = event.composedPath();
        const isKeyboardClick = path.includes(this.keyboard);
        const isTextFieldClick = path.includes(this.textField);

        // Only hide if click is outside both keyboard and text field
        if (!isKeyboardClick && !isTextFieldClick) {
            this.isKeyboardVisible = false;
        }
    }
}