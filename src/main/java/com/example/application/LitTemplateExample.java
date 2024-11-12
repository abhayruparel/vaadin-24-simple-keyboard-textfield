package com.example.application;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.littemplate.LitTemplate;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.template.Id;
import com.vaadin.flow.router.Route;

@Route("lit-route")
@Tag("lit-example")
@JsModule("./lit-example.js")
public class LitTemplateExample extends LitTemplate {
    @Id("field1")
    InputWithKeyboard field1;

    public LitTemplateExample() {
        field1.addValueChangeListener(e-> Notification.show("field1="+e.getValue()));
    }
}
