package com.example.application;

import com.vaadin.flow.component.*;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.shared.Registration;

@Tag("simple-keyboard-text-field")
@JsModule("./simple-keyboard-text-field.js")
@NpmPackage(value = "simple-keyboard", version = "3.3.27")
public class SimpleKeyboardTextField extends TextField {

    private static final PropertyDescriptor<Boolean, Boolean> showVirtualKeyboardDescriptor = PropertyDescriptors.propertyWithDefault("showVirtualKeyboard", true);

    public SimpleKeyboardTextField() {
    }

    public void setShowVirtualKeyboard(boolean show) {
        showVirtualKeyboardDescriptor.set(this, show);
    }

    public boolean isShowVirtualKeyboard() {
        return showVirtualKeyboardDescriptor.get(this);
    }

    // Define a custom event for capturing the value-change event from the client side
    @DomEvent("value-change")
    public static class SimpleKeyboardCustomValueChangeEvent extends ComponentEvent<SimpleKeyboardTextField> {
        private final String value;

        public SimpleKeyboardCustomValueChangeEvent(SimpleKeyboardTextField source, boolean fromClient, @EventData("event.detail.value") String value) {
            super(source, fromClient);
            this.value = value;
        }

        public String getCustomValue() {
            return value;
        }
    }

    // Custom listener method for handling custom value-change events
    public Registration addCustomValueChangeListener(ComponentEventListener<SimpleKeyboardCustomValueChangeEvent> listener) {
        return addListener(SimpleKeyboardCustomValueChangeEvent.class, listener);
    }
}