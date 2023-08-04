//This file is not in use anymore, but may be important if backend parsing is ever expanded on.
public class Link {
    String id;
    Integer source;
    Integer destination;
    String color;
    String type;
    Integer size;

    public Link(String _id, Integer _source, Integer _destination, String _color, String _type, Integer _size) {
        id = _id;
        source = _source;
        destination = _destination;
        color = _color;
        type = _type;
        size = _size;
    }
}
