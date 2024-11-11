package com.example.application;

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
        this.add(field1, field2, field3, field4);
    }
}
