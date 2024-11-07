package com.example.application;


import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.router.Route;

@Route("custom")
public class CustomLogic extends HorizontalLayout {
    public CustomLogic() {
        InputWithKeyboard field1 = new InputWithKeyboard();
        InputWithKeyboard field2 = new InputWithKeyboard();
        InputWithKeyboard field3 = new InputWithKeyboard();

        // Add value change listeners to show notifications
        field1.addValueChangeListener(event -> Notification.show("Field 1 Value: " + event.getValue()));
        field2.addValueChangeListener(event -> Notification.show("Field 2 Value: " + event.getValue()));
        field3.addValueChangeListener(event -> Notification.show("Field 3 Value: " + event.getValue()));

        // Add components to the layout
        add(field1, field2, field3);
    }
}
