package com.example.application;

import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;

@Tag("input-with-keyboard")
@JsModule("./keyboard2.ts")
public class InputWithKeyboard extends AbstractField<InputWithKeyboard, String> {

    public InputWithKeyboard(String height, String width) {
        super(""); // Default value is set to empty string

        // Synchronize the value property with the "value-changed" event
        getElement().addPropertyChangeListener("currentValue", "value-changed",
                event -> {
                    String newValue = event.getValue().toString();
                    setModelValue(newValue, true); // Update the model value
                });

        // Listen for the "text-field-ready" event, if needed, to handle initialization
        getElement().addEventListener("input-field-ready", e -> {
            // Retrieve the textField element and call setInputFieldStyle (if needed)
            setInputFieldStyle(height, width);
        });
    }
    public InputWithKeyboard() {
        this("100%", "100%");
    }

    @Override
    protected void setPresentationValue(String newPresentationValue) {
        getElement().setProperty("currentValue", newPresentationValue);
    }

    @Override
    public void setValue(String value) {
        super.setValue(value);
        getElement().setProperty("currentValue", value);  // Update element property
    }

    @Override
    public String getValue() {
        return getElement().getProperty("currentValue", "");
    }

    @Override
    public void setReadOnly(boolean readOnly) {
        getElement().setProperty("readonly", readOnly);
    }

    @Override
    public boolean isReadOnly() {
        return getElement().getProperty("readonly", false);
    }

    @Override
    public void setRequiredIndicatorVisible(boolean requiredIndicatorVisible) {
        getElement().setProperty("required", requiredIndicatorVisible);
    }

    @Override
    public boolean isRequiredIndicatorVisible() {
        return getElement().getProperty("required", false);
    }

    // Set the input field style (dynamically called from Java)
    private void setInputFieldStyle(String height, String width) {
        // Call JavaScript method setInputStyle on the custom element
        getElement().executeJs("this.setInputStyle($0, $1)", height, width);
    }

    public void setInputStyle(String height, String width) {
        setInputFieldStyle(height, width);
    }

    public void setInputType(String type) {
        getElement().setProperty("inputType", type);
    }
}
