package com.example.application;

import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;

@Tag("input-with-keyboard")
@JsModule("./keyboard2.ts")
public class InputWithKeyboard extends AbstractField<InputWithKeyboard, String> {

    public InputWithKeyboard() {
        super("");

        // Synchronize the value property
        getElement().addPropertyChangeListener("currentValue", "value-changed",
                event -> {
                    String newValue = event.getValue().toString();
                    setModelValue(newValue, true);
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
}