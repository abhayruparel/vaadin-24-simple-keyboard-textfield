import {html, LitElement, css} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import '@vaadin/text-field';
import {TextField} from '@vaadin/text-field';

@customElement('input-with-keyboard')
export class InputWithKeyboard extends LitElement {
    @property({type: String, reflect: true})
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
            left: 0;
            bottom: 0;
            width: 100vw;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
                    >${letter}
                    </div>
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
            detail: {value: this.currentValue},
            bubbles: true,
            composed: true
        }));
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
            // this.updateKeyboardPosition();
        }
    }
    // removed dynamic positioning as I want to mimic bottom keyboard same as in phones
    // private updateKeyboardPosition() {
    //     if (this.keyboard && this.textField) {
    //         const textFieldRect = this.textField.getBoundingClientRect();
    //         this.keyboard.style.top = `${textFieldRect.bottom + 5}px`;
    //         this.keyboard.style.left = `${textFieldRect.left}px`;
    //     }
    // }

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