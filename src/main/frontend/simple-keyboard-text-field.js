import { css } from 'lit';
import { TextField } from '@vaadin/text-field';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

class SimpleKeyboardTextField extends TextField {
    static get properties() {
        return {
            ...super.properties,
            showVirtualKeyboard: { type: Boolean }
        };
    }

    static get styles() {
        return [
            TextField.styles,
            css`
                .simple-keyboard {
                    display: none; /* Initially hidden */
                    margin-top: 8px;
                }
                .simple-keyboard.visible {
                    display: block; /* Show when needed */
                }
                .hg-theme-default{background-color:#ececec;border-radius:5px;box-sizing:border-box;font-family:HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;overflow:hidden;padding:5px;touch-action:manipulation;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:100%}.hg-theme-default .hg-button span{pointer-events:none}.hg-theme-default button.hg-button{border-width:0;font-size:inherit;outline:0}.hg-theme-default .hg-button{display:inline-block;flex-grow:1}.hg-theme-default .hg-row{display:flex}.hg-theme-default .hg-row:not(:last-child){margin-bottom:5px}.hg-theme-default .hg-row .hg-button:not(:last-child){margin-right:5px}.hg-theme-default .hg-row .hg-button-container{margin-right:5px}.hg-theme-default .hg-row>div:last-child{margin-right:0}.hg-theme-default .hg-row .hg-button-container{display:flex}.hg-theme-default .hg-button{-webkit-tap-highlight-color:rgba(0,0,0,0);align-items:center;background:#fff;border-bottom:1px solid #b5b5b5;border-radius:5px;box-shadow:0 0 3px -1px rgba(0,0,0,.3);box-sizing:border-box;cursor:pointer;display:flex;height:40px;justify-content:center;padding:5px}.hg-theme-default .hg-button.hg-standardBtn{width:20px}.hg-theme-default .hg-button.hg-activeButton{background:#efefef}.hg-theme-default.hg-layout-numeric .hg-button{align-items:center;display:flex;height:60px;justify-content:center;width:33.3%}.hg-theme-default .hg-button.hg-button-numpadadd,.hg-theme-default .hg-button.hg-button-numpadenter{height:85px}.hg-theme-default .hg-button.hg-button-numpad0{width:105px}.hg-theme-default .hg-button.hg-button-com{max-width:85px}.hg-theme-default .hg-button.hg-standardBtn.hg-button-at{max-width:45px}.hg-theme-default .hg-button.hg-selectedButton{background:rgba(5,25,70,.53);color:#fff}.hg-theme-default .hg-button.hg-standardBtn[data-skbtn=".com"]{max-width:82px}.hg-theme-default .hg-button.hg-standardBtn[data-skbtn="@"]{max-width:60px}.hg-candidate-box{background:#ececec;border-bottom:2px solid #b5b5b5;border-radius:5px;display:inline-flex;margin-top:-10px;max-width:272px;position:absolute;transform:translateY(-100%);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ul.hg-candidate-box-list{display:flex;flex:1;list-style:none;margin:0;padding:0}li.hg-candidate-box-list-item{align-items:center;display:flex;height:40px;justify-content:center;width:40px}li.hg-candidate-box-list-item:hover{background:rgba(0,0,0,.03);cursor:pointer}li.hg-candidate-box-list-item:active{background:rgba(0,0,0,.1)}.hg-candidate-box-prev:before{content:"◄"}.hg-candidate-box-next:before{content:"►"}.hg-candidate-box-next,.hg-candidate-box-prev{align-items:center;background:#d0d0d0;color:#969696;cursor:pointer;display:flex;padding:0 10px}.hg-candidate-box-next{border-bottom-right-radius:5px;border-top-right-radius:5px}.hg-candidate-box-prev{border-bottom-left-radius:5px;border-top-left-radius:5px}.hg-candidate-box-btn-active{color:#444}
            `
        ];
    }

      constructor() {
             super();
             this.showVirtualKeyboard = true;
             this.keyboard = null;
             this._boundOnFocus = this._onFocus.bind(this);
         }

         firstUpdated() {
             super.firstUpdated();

             // Create and style the keyboard container
             this.keyboardContainer = document.createElement('div');
             this.keyboardContainer.className = 'simple-keyboard';
             this.shadowRoot.appendChild(this.keyboardContainer);

             // Initialize simple-keyboard
             this.keyboard = new Keyboard(this.keyboardContainer, {
                 onChange: input => this._handleKeyboardInput(input),
                 layout: {
                     default: [
                         "1 2 3 4 5 6 7 8 9 0",
                         "q w e r t y u i o p",
                         "a s d f g h j k l",
                         "z x c v b n m",
                         "{space} {backspace}"
                     ]
                 },
                 display: {
                     "{space}": "Space",
                     "{backspace}": "⌫"
                 }
             });

             // Set up event listeners
             this.inputElement.addEventListener('focus', this._boundOnFocus);
             document.addEventListener('click', this._onDocumentClick.bind(this));
         }

         _handleKeyboardInput(input) {
             this.value = input;
             this._dispatchValueChange(input);
         }

         _dispatchValueChange(value) {
             this.dispatchEvent(new CustomEvent('value-change', {
                 detail: { value },
                 bubbles: true,
                 composed: true
             }));
         }

         _onFocus() {
             if (this.showVirtualKeyboard) {
                 this.keyboardContainer.classList.add('visible');
                 this.keyboard.setInput(this.value || '');
             }
         }

         _onDocumentClick(event) {
             // Hide keyboard if clicked outside the component and keyboard container
             if (!this.contains(event.target) &&
                 !this.keyboardContainer.contains(event.target)) {
                 this._hideKeyboard();
             }
         }

         _hideKeyboard() {
             if (this.showVirtualKeyboard) {
                 this.keyboardContainer.classList.remove('visible');
             }
         }

         disconnectedCallback() {
             super.disconnectedCallback();
             this.inputElement.removeEventListener('focus', this._boundOnFocus);
             document.removeEventListener('click', this._onDocumentClick);
         }
     }
customElements.define('simple-keyboard-text-field', SimpleKeyboardTextField);
