package com.example.application.views;


import com.example.application.SimpleKeyboardTextField;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class ExampleView extends VerticalLayout {

    public ExampleView() {
        SimpleKeyboardTextField keyboardField1 = new SimpleKeyboardTextField();
        keyboardField1.setLabel("Field with virtual keyboard");
        keyboardField1.setShowVirtualKeyboard(true);

        SimpleKeyboardTextField keyboardField2 = new SimpleKeyboardTextField();
        keyboardField2.setLabel("Field without virtual keyboard");
        keyboardField2.setShowVirtualKeyboard(true);

        keyboardField2.addCustomValueChangeListener(event -> {
            String newValue = event.getCustomValue();
            System.out.println("New value for keyboardField2: " + newValue);
            // Further actions on value change
        });

        add(keyboardField1, keyboardField2);
    }
}