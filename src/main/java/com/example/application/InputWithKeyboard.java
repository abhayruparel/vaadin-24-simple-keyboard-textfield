package com.example.application;

import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasValue.ValueChangeListener;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.textfield.TextField;

@JsModule("./keyboard.js") // Import the JavaScript module for handling keyboard positioning
public class InputWithKeyboard extends Div {

    private TextField textField;
    private Div keyboard;
    private String currentValue = "";

    public InputWithKeyboard() {
        textField = new TextField();
        textField.addFocusListener(event -> showKeyboard());
        textField.addBlurListener(event -> hideKeyboard());

        // Create the on-screen keyboard
        keyboard = createKeyboard();

        // Use HorizontalLayout for arranging the input field and keyboard
        HorizontalLayout layout = new HorizontalLayout();
        layout.add(textField, keyboard);
        add(layout);

        // Apply some basic styles for the keyboard
        setWidthFull();
    }

    private Div createKeyboard() {
        Div keyboardContainer = new Div();
        keyboardContainer.addClassName("keyboard-container");
        keyboardContainer.setVisible(false);

        // Add some basic CSS styles for visibility and positioning
        keyboardContainer.getStyle().set("position", "absolute")
                .set("background", "lightgrey")
                .set("border", "1px solid black")
                .set("padding", "10px");

        // Create keys from A to Z
        String[] keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        HorizontalLayout keyRow = new HorizontalLayout();

        for (String key : keys) {
            keyRow.add(createKey(key));
        }

        keyboardContainer.add(keyRow);
        return keyboardContainer;
    }

    private Component createKey(String key) {
        Div keyDiv = new Div();
        keyDiv.setText(key);
        keyDiv.addClickListener(e -> appendValue(key));
        keyDiv.addClassName("key");
        keyDiv.getStyle().set("margin", "5px")
                .set("padding", "10px")
                .set("cursor", "pointer");
        return keyDiv;
    }

    private void appendValue(String value) {
        currentValue += value;
        textField.setValue(currentValue);
        // Notify value change
        Notification.show("Current Value: " + currentValue);
    }

    private void showKeyboard() {
        keyboard.setVisible(true);

        getUI().ifPresent(ui -> ui.getPage().executeJs(
                "const rect = $0.getBoundingClientRect();" +
                        "$1.style.top = rect.bottom + window.scrollY + 'px';" +
                        "$1.style.left = rect.left + 'px';" +
                        "$1.style.visibility = 'visible';", // Ensure visibility
                textField.getElement(), keyboard.getElement()
        ));
    }


    private void hideKeyboard() {
        // Prevent hiding the keyboard if clicked within the keyboard container
        getUI().ifPresent(ui -> ui.getPage().executeJs(
                "document.addEventListener('mousedown', function(event) {" +
                        "  if (!$0.contains(event.target) && !$1.contains(event.target)) {" +
                        "    $1.style.visibility = 'hidden';" +
                        "  }" +
                        "});",
                textField.getElement(), keyboard.getElement()
        ));
    }


    // Expose the getValue() method for external use
    public String getValue() {
        return textField.getValue();
    }

    // Expose a method to add value change listeners to the internal text field
    public void addValueChangeListener(ValueChangeListener<AbstractField.ComponentValueChangeEvent<TextField, String>> listener) {
        textField.addValueChangeListener(listener);
    }
}