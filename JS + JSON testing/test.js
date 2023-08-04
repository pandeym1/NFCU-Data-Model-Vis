//Use this file to test out parsing and converting data into JSON without having to actually run the whole application. Currently only handling JSON.
document.addEventListener("DOMContentLoaded", function () {
    let graph2;
class Node {
    constructor(_appliesTO, _NodeName, _NodeType, _PageClass, _StringType, _Version, _UpdateDateTime, _UpdateOpName, _Rule, _NodeSize, _NodeColor) {
      this._appliesTO = _appliesTO;
      this._NodeName = _NodeName;
      this._NodeType = _NodeType;
      this._PageClass = _PageClass;
      this._StringType = _StringType;
      this._Version = _Version;
      this._UpdateDateTime = _UpdateDateTime;
      this._UpdateOpName = _UpdateOpName;
      this._Rule = _Rule;
      this._NodeSize = _NodeSize;
      this._NodeColor = _NodeColor;
    }
  }

  class Link {
    constructor(_id, _src, _dest, _color, _type, _size) {
      this._id = _id;
      this._src = _src;
      this._dest = _dest;
      this._color = _color;
      this._type = _type;
      this._size = _size;
    }
  }

  function pickColor(val) {
    if (val != ("String")) {
        return "#ffa600";
    }

    return "#ff6361";
  }

  function pickSize(val) {
    if (val !== ("String")) {
        return 23;
    }

    return 15;
  }

  function lookingForThis(val, array) {
    //console.log('Looking for this: ' + val);
    var a = val;

    for (let i = 0; i < array.length; i++) {
      if (array[i]._NodeName == val) {
        return true;
      }
    }

    return false;
  }

  function findNodeIndex (val, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i]._NodeName == val) {
        return i;
      }
    }

    return -1;
  }

  function getFileExtension(fileName) {
    return fileName.split('.').pop();
  }

  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader(); 
    const fileExt = getFileExtension(file.name);
    console.log('test');
    console.log(file.name);
    console.log(getFileExtension(file.name));
    const NodeArray = [];
    const LinkArray = [];
    var jsonData;
    var csvData;


    reader.onload = function(e) {
      const fileContent = e.target.result;
      if (fileExt == "json") {
      jsonData = JSON.parse(fileContent);
      const NodeArrayTmp = [];

      console.log(jsonData);
      
      //Storing inital data in array of Node object. This is done for sigma.
      if (Array.isArray(jsonData)) {
        jsonData.forEach(ele => {
          //console.log(ele.pyClassName);
          const tmpNode = new Node(ele.pyClassName, ele.pyPropertyName, ele.pyPropertyMode, ele.pyPageClass, ele.pyStringType, ele['pyTextValue(1)'], ele.pxUpdateDateTime, ele.pxUpdateOpName, ele.pzInsKey, pickSize(ele.pyPropertyMode), pickColor(ele.pyPropertyMode));
          NodeArray.push(tmpNode);
        })
      } else {
        console.error('The JSON is not a data array')
      }

      //This for exception handling. Any nodes mentioned in the dataset but not present will have a dummy node generated for them with null values for most properties. (this needs to be fixed)
      let minusI = 0;
      for (let i = 0; i < NodeArray.length - minusI; i++) {
        if (!lookingForThis(NodeArray[i]._appliesTO, NodeArray)) {
          const tmpNode = new Node(null, NodeArray[i]._appliesTO, "class", null, null, null, null, null, null, 23, "#ffa600");
          NodeArray.push(tmpNode);
          minusI++;
        }

        if (!lookingForThis(NodeArray[i]._PageClass, NodeArray) && !NodeArray[i]._PageClass == null && !NodeArray[i]._PageClass == "class") {
          const tmpNode = new Node(null, NodeArray[i]._PageClass, "class", null, null, null, null, null, null, 23, "#ffa600");
          NodeArray.push(tmpNode);
          const tmpLink = new Link("p" + i, i, NodeArray.length-1, "#003f5c",  NodeArray[i]._StringType, 6);
          LinkArray.push(tmpLink);
          minusI++;
        }
    }
  } else if (fileExt == "csv") {
    const rows = fileContent.split('\n');
    const result = [];

    for (const row of rows) {
      const values = row.split(',');
      result.push(values);
    }

    if (Array.isArray(result)) {
      for (let i = 1; i < result.length; i++) {
        const tmpNode = new Node(result[i][0], result[i][1], result[i][2], result[i][3], result[i][4], result[i][5], result[i][6], result[i][7], result[i][result[i].length-1], pickSize(result[i][2]), pickColor(result[i][2]));
        NodeArray.push(tmpNode);
      }
    } else {
      console.error('The CSV is not a data array')
    }

    //This for exception handling. Any nodes mentioned in the dataset but not present will have a dummy node generated for them with null values for most properties. (this needs to be fixed)
    let minusI = 0;
    for (let i = 0; i < NodeArray.length - minusI; i++) {
      if (!lookingForThis(NodeArray[i]._appliesTO, NodeArray)) {
        const tmpNode = new Node(null, NodeArray[i]._appliesTO, "class", null, null, null, null, null, null, 23, "#ffa600");
        NodeArray.push(tmpNode);
        minusI++;
      }

      if (!lookingForThis(NodeArray[i]._PageClass, NodeArray) && !NodeArray[i]._PageClass == null && !NodeArray[i]._PageClass == "class") {
        const tmpNode = new Node(null, NodeArray[i]._PageClass, "class", null, null, null, null, null, null, 23, "#ffa600");
        NodeArray.push(tmpNode);
        const tmpLink = new Link("p" + i, i, NodeArray.length-1, "#003f5c",  NodeArray[i]._StringType, 6);
        LinkArray.push(tmpLink);
        minusI++;
      }
    }
  }

    for (let i = 0; i < NodeArray.length; i++) {
      if (lookingForThis(NodeArray[i]._appliesTO, NodeArray)) {
        var type1 = "";
        const type2 = NodeArray[i]._NodeType;

        for (let j = 0; j < NodeArray.length; j++) {
          if (NodeArray[j]._NodeName == NodeArray[i]._NodeType) { //This logic might be and need to be replaced
            type1 = NodeArray[j]._NodeType;
          }
        }

        if (type1 == "String" || type2 == "String") {
          const tmpLink = new Link("l" + i, i, findNodeIndex(NodeArray[i]._appliesTO, NodeArray), "#58508d",  NodeArray[i]._StringType, 4);
          LinkArray.push(tmpLink);
        } else {
          const tmpLink = new Link("l" + i, i, findNodeIndex(NodeArray[i]._appliesTO, NodeArray), "#003f5c",  NodeArray[i]._StringType, 6);
          LinkArray.push(tmpLink);
        }

      }

    graph2 = "{\nnodes: [\n";;
    for (let i = 0; i < NodeArray.length; i++) {
      graph2 += "{id: \"" + i + "\", label: \"" + NodeArray[i]._NodeName + "\", name: \"" + NodeArray[i]._NodeName + "\", tooltip: \"" + NodeArray[i]._NodeName + "<br>Node type: " + NodeArray[i]._NodeType + "<br>Page class: " + NodeArray[i]._PageClass + "<br>String type: " + NodeArray[i]._StringType + "<br>Version: " + NodeArray[i]._Version + "<br>UpdateDateTime: " + NodeArray[i]._UpdateDateTime + "<br>Rule: " + NodeArray[i]._Rule + "\", x: " + Math.random() * 5000 + ", y: " + Math.random() * 5000 + ", size: " + NodeArray[i]._NodeSize + ", OGcolor: \"" + NodeArray[i]._NodeColor + "\", color: \"" + NodeArray[i]._NodeColor + "\"}, \n";
    }
    graph2 += "],\nedges: [\n";
    for (let i = 0; i < LinkArray.length; i++) {
      graph2 += "{id: \"" + LinkArray[i]._id + "\", source: \"" + LinkArray[i]._src + "\", target: \"" + LinkArray[i]._dest + "\", OGcolor: \"" + LinkArray[i]._color + "\", color: \"" + LinkArray[i]._color + "\", type: \"arrow\", size: \"" +  LinkArray[i]._size + "\"},\n";
    }
    graph2 += "]\n}";
    }

      NodeArray.forEach(ele => {
        //console.log(ele);
      });

      console.log(NodeArray);
      console.log(LinkArray);
      console.log(jsonData);
      //console.log(graph2);
    }
    reader.readAsText(file);
  });

  window.addEventListener("load", function() {
    this.document.getElementById("revealInfo").addEventListener("click", showUploadedData);
  });

  function showUploadedData() {
    console.log(graph2);
  }
  console.log(graph2);
});