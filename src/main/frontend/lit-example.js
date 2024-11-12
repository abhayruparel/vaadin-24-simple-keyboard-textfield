import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

class LitTemplateExample extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      gap: 1em;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
    input-with-keyboard {
      --input-width: 100%;
      --input-height: 50px;
    }
  `;

  render() {
    return html`
      <div class="container">
        <!-- Initialize input-with-keyboard with two-way binding on field1Value -->
        <input-with-keyboard
          id="field1"
          style="width:500px;height:200px"
        ></input-with-keyboard>
      </div>
    `;
  }
}
customElements.define("lit-example", LitTemplateExample)
