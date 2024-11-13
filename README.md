Vaadin 24 Library for Onscreen Keyboard for Textfields
This library is built using Lit template and requires no additional npm packages.

Example Usage of InputWithKeyboard
Java Example
```java
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("custom")
public class CustomLogic extends VerticalLayout {
    public CustomLogic() {
    this.setWidthFull();
    this.setHeightFull();

    InputWithKeyboard field1 = new InputWithKeyboard("200px", "200px");
    InputWithKeyboard field2 = new InputWithKeyboard("100%", "100%");
    InputWithKeyboard field3 = new InputWithKeyboard("100%", "100%");
    InputWithKeyboard field4 = new InputWithKeyboard("100%", "100%");
    
    field1.addValueChangeListener(event -> Notification.show("Field 1 Value: " + event.getValue()));
    field2.addValueChangeListener(event -> Notification.show("Field 2 Value: " + event.getValue()));
    field3.addValueChangeListener(event -> Notification.show("Field 3 Value: " + event.getValue()));
    field3.setValue("9");
    
    Button b = new Button("Click me to see field1 value");
    b.addClickListener(e -> Notification.show(field1.getValue()));
    
    this.add(b, field1, field2, field3, field4);
    }
}
```
Example Usage of LitTemplate
```java
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.testbench.InputElement;
import com.vaadin.flow.component.littemplate.LitTemplate;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.notification.Notification;

@Route("lit-route")
@Tag("lit-example")
@JsModule("./lit-example.js")
public class LitTemplateExample extends LitTemplate {
@Id("field1")
InputWithKeyboard field1;

    public LitTemplateExample() {
        field1.addValueChangeListener(e -> Notification.show("field1=" + e.getValue()));
    }
}
```
```html
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
                <input-with-keyboard
                    id="field1"
                    style="width: 500px; height: 200px;"
                ></input-with-keyboard>
            </div>
        `;
    }
}
customElements.define("lit-example", LitTemplateExample);
```
## Usage
Clone this Project: Clone this repository and perform a clean install to update your Maven cache.

Use the Component: Now you can use the input-with-keyboard tag in your Lit template or use the InputWithKeyboard Java class.

### To-Do
Publish to Maven: Once the package is published to Maven Central, you can add it to your pom.xml or build.gradle and start using it.

Feel free to ask if you need further assistance! 😃