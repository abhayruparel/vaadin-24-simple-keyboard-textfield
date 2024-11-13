package com.example.application;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("custom")
public class VerticalLayoutExample extends VerticalLayout {
    public VerticalLayoutExample() {
        this.setWidthFull();
        this.setHeightFull();
        InputWithKeyboard field1 = new InputWithKeyboard("200px", "200px");
        field1.setInputType("number");
        // field1.setReadOnly(true);
        InputWithKeyboard field2 = new InputWithKeyboard("100%", "100%");
        InputWithKeyboard field3 = new InputWithKeyboard("100%", "100%");
        InputWithKeyboard field4 = new InputWithKeyboard("100%", "100%");
        field1.addValueChangeListener(event -> Notification.show("Field 1 Value: " + event.getValue()));
        field2.addValueChangeListener(event -> Notification.show("Field 2 Value: " + event.getValue()));
        field3.addValueChangeListener(event -> Notification.show("Field 3 Value: " + event.getValue()));
        field3.setValue("9");
        Button b = new Button("Click me to see field1 value");
        b.addClickListener(e-> Notification.show(field1.getValue()));
        this.add(b, field1, field2, field3, field4);
    }
}
