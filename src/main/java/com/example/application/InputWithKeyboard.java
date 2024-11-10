package com.example.application;

import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.HasElement;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;

@Tag("input-with-keyboard")
@JsModule("./keyboard2.ts")
public class InputWithKeyboard extends AbstractField<InputWithKeyboard, String> {

    public InputWithKeyboard(String heigth, String width) {
        super("");

        // Synchronize the value property
        getElement().addPropertyChangeListener("currentValue", "value-changed",
                event -> {
                    String newValue = event.getValue().toString();
                    setModelValue(newValue, true);
                });

        // Listen for the text-field-ready event
        getElement().addEventListener("text-field-ready", e -> {
            // Retrieve the textField element and call setInputFieldStyle
            setInputFieldStyle(heigth, width);
        });
    }

    @Override
    protected void setPresentationValue(String newPresentationValue) {
        getElement().setProperty("currentValue", newPresentationValue);
    }

    @Override
    public void setValue(String value) {
        super.setValue(value);
        getElement().setProperty("currentValue", value);
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

    // Set the input field style
    private void setInputFieldStyle(String height, String width) {
        // Call JavaScript method setInputStyle on the custom element
        getElement().executeJs("this.setInputStyle($0, $1)", height, width);
    }
}
