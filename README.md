# vaadin 24 library for onscreen keyboard for textfields.
Build using lit template no additiona npm packages are needed.

An example usage inside of InputWithKeyboard.
```
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
        Button b = new Button("Click me to see field1 value");
        b.addClickListener(e-> Notification.show(field1.getValue()));
        this.add(b, field1, field2, field3, field4);
    }
}
```

## todo publish to maven
Once the package is published to the maven central you can add the package in your pom to gradle import and start using it. :D.

