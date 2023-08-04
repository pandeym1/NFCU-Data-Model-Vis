document.addEventListener("DOMContentLoaded", function () {
  //If you want to change the colors of nodes and links just edit the items below. Use hex codes.    
  const PRIM_COLOR = "#0474BA";
  const CLASS_COLOR = "#F17720";
  const PAGE_LINK_COLOR = "#FF007F";
  const NORM_LINK_COLOR = "#588061";

  //used for clicking feature
  sigma.classes.graph.addMethod('neighbors', function(nodeId) {
  var k,
  neighbors = {},
  index = this.allNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors[k] = this.nodesIndex[k];

  return neighbors;
});

/* 
Initialized sigma
-----------------
Edit settings to change display properties about graph.
Refer to sigm.js in builds for help with settings.
*/
var s = new sigma(
  {
    renderer: {
      container: document.getElementById('sigma-container'),
      type: 'canvas',
      labels: {
        renderLabel: function (node, context, settings) {
          const size = node.size;
          const fontSize = 1;

          context.font = fontSize + 'px Arial';
          sigma.utils.labels.image(node, context, settings);
        }
      }
    },
    settings: {
     minEdgeSize: 0.1,
     maxEdgeSize: 0.2,
     minNodeSize: 1,
     labelThreshold: 3,
     maxNodeSize: 20,
     batchEdgesDrawing: false,
     hideEdgesOnMove: false,
    }
  }
);

//Saving previously clicked node id
var prevNodeID;


var graph3;
//function that the check mark button calls
function showUploadedData() {
  s.graph.clear();
  graph = graph3;

  // Load the graph in sigma
  s.graph.read(graph);
  //dynamically changing node sizes based on links connected to it. Can modify the node.size section if you want a different node dynamic node size.
  s.graph.nodes().forEach(node => {
    const numLinks = s.graph.degree(node.id);
    if (numLinks > 1) {
      node.size = node.size + (numLinks * 1.85);
    }
  });

  //display grah in circle first
  s.graph.nodes().forEach(function(node, i, a) {
    node.x = Math.cos(Math.PI * 2 * i / a.length);
    node.y = Math.sin(Math.PI * 2 * i / a.length);
    });
  
  //Calling fruchtermanReingold. IMPORTANT NOTE: This also causes massive slow down, so it should be optimized so no time outs occur.
    var frListener = sigma.layouts.fruchtermanReingold.configure(s, {maxIterations: 200, duration: 800});
    frListener.bind('start stop', function(e) {

    });
    
    sigma.layouts.fruchtermanReingold.start(s);

  s.refresh();
}

//Interactive features of application init
const suggestionBox = document.getElementById('suggestionBox');
const searchInputInputs = document.getElementById('searchInput');

searchInputInputs.addEventListener('input', handleInput);
suggestionBox.addEventListener('click', handleSuggestionClick);

//Action that will happen when graph suggestion is clicked
function handleSuggestionClick(event) {
  const clickedNode = event.target.innerText;
  document.getElementById('searchInput').value = clickedNode;
}

//How suggestions appear below the search bar
function handleInput() {
  const searchText = searchInputInputs.value.toLowerCase();
  const matchingNodes = findMatchingNodes(searchText);

  suggestionBox.innerHTML = '';

  matchingNodes.forEach(node => {
    const suggestionItem = document.createElement('div');
    suggestionItem.innerText = node.name;
    suggestionItem.setAttribute("class", "sugStyle");
    suggestionBox.appendChild(suggestionItem);
  });
}

//helper function for above function 
function findMatchingNodes(searchText) {
  const allNodes = s.graph.nodes();

  const matchingNodes = allNodes.filter(node => {
    if (searchText.length === 1) {
      return true;
    } else if (searchText === '') {
      return false;
    } else {
      const nodeName = node.name.toLowerCase();
      return nodeName.includes(searchText);
    }
  });

  return matchingNodes;
}

//function selects the node, then zooms in on node when called. Takes value from inside of search bar.
function searchNode() {
  var searchInput = document.getElementById("searchInput").value;
  var nodeID;

  if (nodeID != prevNodeID) {
    s.graph.nodes().forEach(function (n) {
      n.color = n.OGcolor;
    })
  }

  var node = s.graph.nodes().find(function (n) {
    if (n.name === searchInput) {
      nodeID = n.id;
      return true;
    }
  });

  if (node && (nodeID != prevNodeID)) {
    selectNode(node);
    prevNodeID = nodeID;
    zoomToNode(nodeID);
  }

  s.refresh();
}

//helpful info pop up. Default setting is not to display when application starts
var x = document.getElementById("showingHelpInfo");
x.style.display = "none";

function showHelpInfo() {
  var x = document.getElementById("showingHelpInfo");

  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//Calls search node when enter key is pressed
document.getElementById("searchInput").addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    searchNode();
  }
});

//zooms to node with correct nodeID put into function. First resets camera before zooming in.
function zoomToNode(nodeID) {
  const position = s.graph.nodes(nodeID).x;
  const position2 = s.graph.nodes(nodeID).y;
  c.goTo({x: position, y: position, ratio: initRatio});
  c.goTo({x: position, y: position2, ratio: c.ratio / (c.settings('zoomingRatio') + 2)});
  s.refresh();
}

var c = s.camera;
var initRatio = c.ratio;

//button zoom in
function zoomIn() {
  c.goTo({
    ratio: c.ratio / c.settings('zoomingRatio')
  });
}

//button zoom out
function zoomOut () {
  c.goTo({
    ratio: c.ratio * c.settings('zoomingRatio')
  });
}

//Addding event listeners to buttons to handle user input
window.addEventListener("load", function() {
  document.getElementById("Zin").addEventListener("click", zoomIn);
});

window.addEventListener("load", function() {
  document.getElementById("Zout").addEventListener("click", zoomOut);
});

window.addEventListener("load", function() {
  this.document.getElementById("MoreInfo").addEventListener("click", showHelpInfo)
})

window.addEventListener("load", function() {
  this.document.getElementById("revealInfo").addEventListener("click", showUploadedData);
});

/*
selecting a node will... 
-make all non neighbors color grey 
-make non neighbor node links clear
-disable tooltip display
-reset graph to default if same node is selected twice
*/
function selectNode(node) {
  var nodeId = node.id;

  if (prevNodeID != nodeId) {
    prevNodeID = nodeId;
  var toKeep = s.graph.neighbors(nodeId);
  var toKeep2 = {};
  toKeep[nodeId] = node;
  
  if (node.NodeType == "PageList" || node.NodeType == "Page") {
    s.graph.nodes().forEach(function(n) {
      if (toKeep[n.id]) {
        if (toKeep[n.id].NodeType == "class") {
          var toKeepTMP = s.graph.neighbors(n.id);
          s.graph.nodes().forEach(function(m) {
            if (toKeepTMP[m.id]) {
              toKeep2[m.id] = toKeepTMP[m.id];
            }
          });
        }
      }
    })
  }

  s.graph.nodes().forEach(function(n) {
    if (toKeep[n.id]) {
      n.color = n.OGcolor;
      n.label = n.name;
    } else {
      n.color = '#CCCCCC';
      n.label = null;
    }
  });

  s.graph.edges().forEach(function(e) {
    if (toKeep[e.source] && toKeep[e.target]) 
      e.color = e.OGcolor;
    else
      e.color = '#ffffff00';
  });

  s.graph.nodes().forEach(function(n) {
    if (toKeep2[n.id]) {
      n.color = n.OGcolor;
      n.label = n.name;
    }
  });

  s.graph.edges().forEach(function(e) {
    if ((toKeep2[e.source] || toKeep2[e.target]) && s.graph.nodes(e.source).color == s.graph.nodes(e.source).OGcolor && s.graph.nodes(e.target).color == s.graph.nodes(e.target).OGcolor)
      e.color = e.OGcolor;
  });

  }
}

//when mouse leaves display it will reset the label and stop displaying the tooltip
s.bind('outNode', event => {
  const node = event.data.node;
  const element2 = document.getElementById('divTemp');
  element2.remove();
  if (node.label == null) {
    node.label = null;
  } else {
    node.label = node.name;
  }
  node.label.size = 14;
  s.refresh();
});

//displays correct tooltip when mouse hovers over a node 
s.bind('overNode', function(e) {
  var node = e.data.node;
  if (node.label != null) {
    var prefix = s.renderers[0].options.prefix;
    var x = e.data.node[prefix + 'x'];
    var y = e.data.node[prefix + 'y'];
    var div = document.createElement('div');
    div.setAttribute("id", "divTemp");
    div.setAttribute("class", "box");
    div.innerHTML = node.tooltip;
    node.label = div;
    div.style.position = "absolute";
    div.style.left = x +20;
    div.style.top = y;

    document.getElementById('sigma-container').appendChild(div);
    s.refresh();
  }
});

/*
Front end parser
----------------
current support = JSON
when database and server support happens this can move into the backend. 
It is only put into the frontend at the moment to make application functional.
*/
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
    constructor(_id, _src, _dest, _color, _type, _size, _style) {
      this._id = _id;
      this._src = _src;
      this._dest = _dest;
      this._color = _color;
      this._type = _type;
      this._size = _size;
      this._style = _style;
    }
  }

  function pickColor(val) {
    if (val != ("String")) {
        return CLASS_COLOR;
    }

    return PRIM_COLOR;
  }

  function pickSize(val) {
    if (val !== ("String")) {
        return 23;
    }

    return 15;
  }

  function linkStyle(val, val2) {
    if (val == "Page" || val2 == "PageList") {
      return PAGE_LINK_COLOR;
    } else {
      return NORM_LINK_COLOR;
    }
  }

  function lookingForThis(val, array) {
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

    reader.onload = function(e) {
      const fileContent = e.target.result;
      var jsonData;
      const NodeArray = [];
      const LinkArray = [];
      const NodeArrayTmp = [];

      /*
      Parsing for different file formats can be added here by... 
      -reading file extention
      -calling correct parser function based on what is read
      
      Note that as long as information is put into Node and Link object arrays, parser functions will not have to worry about anything else.
      */
      
      //JSON/CSV PARSING START
      //Storing inital data in array of Node object. This is done for sigma. It is done because Pega metadata cannot directly apply to sigma.
      if (fileExt == "json") {
        jsonData = JSON.parse(fileContent);
          if (Array.isArray(jsonData)) {
            jsonData.forEach(ele => {
              const tmpNode = new Node(ele.pyClassName, ele.pyPropertyName, ele.pyPropertyMode, ele.pyPageClass, ele.pyStringType, ele['pyTextValue(1)'], ele.pxUpdateDateTime, ele.pxUpdateOpName, ele.pzInsKey, pickSize(ele.pyPropertyMode), pickColor(ele.pyPropertyMode));
              NodeArray.push(tmpNode);
            })
          } else {
            console.error('The JSON is not a data array')
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
            if (result[i][0]) {
              const tmpNode = new Node(result[i][0], result[i][1], result[i][2], result[i][3], result[i][4], result[i][5], result[i][6], result[i][7], null, pickSize(result[i][2]), pickColor(result[i][2]));
              NodeArray.push(tmpNode);
            }
          }
        } else {
          console.error('The CSV is not a data array')
        }
      }
      //JSON/CSV PARSING END

      //LINK NODE LOGIC START
      //This for exception handling. Any nodes mentioned in the dataset but not present will have a dummy node generated for them with null values for most properties. (this needs to be fixed)
      let minusI = 0;
      for (let i = 0; i < NodeArray.length - minusI; i++) {
        if (!lookingForThis(NodeArray[i]._appliesTO, NodeArray)) {
          const tmpNode = new Node(null, NodeArray[i]._appliesTO, "class", null, null, null, null, null, null, 23, CLASS_COLOR);
          NodeArray.push(tmpNode);
          minusI++;
        }

        if (!lookingForThis(NodeArray[i]._PageClass, NodeArray) && !NodeArray[i]._PageClass == null && !NodeArray[i]._PageClass == "class") {
          const tmpNode = new Node(null, NodeArray[i]._PageClass, "class", null, null, null, null, null, null, 23, CLASS_COLOR);
          NodeArray.push(tmpNode);
          const tmpLink = new Link("p" + i, i, NodeArray.length-1, linkStyle(NodeArray[i]._NodeType, tmpNode._NodeType),  NodeArray[i]._StringType, 6, "arrow");
          LinkArray.push(tmpLink);
          minusI++;
        }
    }

    //Looking for links in _appliesTO area and _PageClass area
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
          const tmpLink = new Link("l" + i, i, findNodeIndex(NodeArray[i]._appliesTO, NodeArray), linkStyle(type1, type2),  NodeArray[i]._StringType, 4, "arrow");
          LinkArray.push(tmpLink);
        } else {
          const tmpLink = new Link("l" + i, i, findNodeIndex(NodeArray[i]._appliesTO, NodeArray), linkStyle(type1, type2),  NodeArray[i]._StringType, 6, "arrow");
          LinkArray.push(tmpLink);
        }

      } 
      if (lookingForThis(NodeArray[i]._PageClass, NodeArray)) {
        let tmpNum = findNodeIndex(NodeArray[i]._PageClass, NodeArray);
        const tmpLink = new Link ("pl" + i, i, tmpNum, linkStyle(NodeArray[i]._NodeType, NodeArray[tmpNum]._NodeType), NodeArray[i]._StringType, 6, "arrow");
        LinkArray.push(tmpLink);
      }
    }
      //these are links that are assumed based on node names. For example: "NFCU-ACCT-LEN" inherits from "NFCU-ACCT"
      for (let i = 0; i < NodeArray.length; i++) {
        const currNode = NodeArray[i]._NodeName;
        const type = NodeArray[i]._StringType;
        
        //Error handling. Must chek if node is not undefined before running this.
        if (currNode) {
            const currNodeParts = currNode.split("-");
          for (let j = i + 1; j < NodeArray.length; j++) {
            const otherNode = NodeArray[j]._NodeName;
            if (otherNode) {
              const otherNodeParts = otherNode.split("-");
              if ((otherNode.includes(currNode) || currNode.includes(otherNode)) && Math.abs(otherNodeParts.length - currNodeParts.length) === 1) { //last part make sure that link only forms if only thing different is by one "-". See above example and count "-".
                  let tmpNum =  findNodeIndex(currNode, NodeArray);
                  let tmpNum2 = findNodeIndex(otherNode, NodeArray);
                  const tmpLink = new Link("nl" + j + i + 1, tmpNum, tmpNum2, linkStyle(NodeArray[tmpNum]._NodeType, NodeArray[tmpNum]._NodeType), type, 6, "arrow");
                  LinkArray.push(tmpLink);
              }
            }
          }
        }
      }
      //LINK NODE LOGIC END

      //parsing graph into JSON format then converting it into JSON
      graph3 = "{\n\"nodes\": [\n";
      for (let i = 0; i < NodeArray.length; i++) {
        if (i + 1 == NodeArray.length) {
          graph3 += "{\"id\": \"" + i + "\", \"label\": \"" + NodeArray[i]._NodeName + "\", \"name\": \"" + NodeArray[i]._NodeName + "\", \"tooltip\": \"" + NodeArray[i]._NodeName + "<br>Node type: " + NodeArray[i]._NodeType + "<br>Page class: " + NodeArray[i]._PageClass + "<br>String type: " + NodeArray[i]._StringType + "<br>Version: " + NodeArray[i]._Version + "<br>UpdateDateTime: " + NodeArray[i]._UpdateDateTime + "<br>Rule: " + NodeArray[i]._Rule + "\", \"x\": " + Math.random() * 5000 + ", \"y\": " + Math.random() * 5000 + ", \"size\": " + NodeArray[i]._NodeSize + ", \"OGcolor\": \"" + NodeArray[i]._NodeColor + "\", \"color\": \"" + NodeArray[i]._NodeColor + "\", \"NodeType\": \"" + NodeArray[i]._NodeType + "\"} \n";
        } else {
          graph3 += "{\"id\": \"" + i + "\", \"label\": \"" + NodeArray[i]._NodeName + "\", \"name\": \"" + NodeArray[i]._NodeName + "\", \"tooltip\": \"" + NodeArray[i]._NodeName + "<br>Node type: " + NodeArray[i]._NodeType + "<br>Page class: " + NodeArray[i]._PageClass + "<br>String type: " + NodeArray[i]._StringType + "<br>Version: " + NodeArray[i]._Version + "<br>UpdateDateTime: " + NodeArray[i]._UpdateDateTime + "<br>Rule: " + NodeArray[i]._Rule + "\", \"x\": " + Math.random() * 5000 + ", \"y\": " + Math.random() * 5000 + ", \"size\": " + NodeArray[i]._NodeSize + ", \"OGcolor\": \"" + NodeArray[i]._NodeColor + "\", \"color\": \"" + NodeArray[i]._NodeColor + "\", \"NodeType\": \"" + NodeArray[i]._NodeType + "\"}, \n";
        }
      }
      graph3 += "]"
      graph3 += ", \"edges\": [\n";
      for (let i = 0; i < LinkArray.length; i++) {
        if (i + 1 == LinkArray.length) {
          graph3 += "{\"id\": \"" + LinkArray[i]._id + "\", \"source\": \"" + LinkArray[i]._src + "\", \"target\": \"" + LinkArray[i]._dest + "\", \"OGcolor\": \"" + LinkArray[i]._color + "\", \"color\": \"" + LinkArray[i]._color + "\", \"type\": \"" + LinkArray[i]._style + "\", \"size\": \"" +  LinkArray[i]._size + "\"}\n";
        } else {
          graph3 += "{\"id\": \"" + LinkArray[i]._id + "\", \"source\": \"" + LinkArray[i]._src + "\", \"target\": \"" + LinkArray[i]._dest + "\", \"OGcolor\": \"" + LinkArray[i]._color + "\", \"color\": \"" + LinkArray[i]._color + "\", \"type\": \"" + LinkArray[i]._style + "\", \"size\": \"" +  LinkArray[i]._size + "\"},\n";
        }
      }
      graph3 += "]\n}";

      graph3 = JSON.parse(graph3);
    }
    reader.readAsText(file);
  });

  //handles clicking node featue
s.bind('clickNode', function(e) {
  var nodeId = e.data.node.id;
  var node = e.data.node;

  if (prevNodeID != nodeId) {
    prevNodeID = nodeId;
    var toKeep = s.graph.neighbors(nodeId);
  var toKeep2 = {};
  toKeep[nodeId] = node;
  
  if (node.NodeType == "PageList" || node.NodeType == "Page") {
    s.graph.nodes().forEach(function(n) {
      if (toKeep[n.id]) {
        if (toKeep[n.id].NodeType == "class") {
          var toKeepTMP = s.graph.neighbors(n.id);
          s.graph.nodes().forEach(function(m) {
            if (toKeepTMP[m.id]) {
              toKeep2[m.id] = toKeepTMP[m.id];
            }
          });
        }
      }
    })
  }

  s.graph.nodes().forEach(function(n) {
    if (toKeep[n.id]) {
      n.color = n.OGcolor;
      if(n.id != nodeId) {
        n.label = n.name;
      }
    } else {
      n.color = '#CCCCCC';
      n.label = null;
    }
  });

  s.graph.edges().forEach(function(e) {
    if (toKeep[e.source] && toKeep[e.target]) 
      e.color = e.OGcolor;
    else
      e.color = '#ffffff00';
  });

  s.graph.nodes().forEach(function(n) {
    if (toKeep2[n.id]) {
      n.color = n.OGcolor;
      if(n.id != nodeId) {
        n.label = n.name;
      }
    }
  });

  s.graph.edges().forEach(function(e) {
    if ((toKeep2[e.source] || toKeep2[e.target]) && s.graph.nodes(e.source).color == s.graph.nodes(e.source).OGcolor && s.graph.nodes(e.target).color == s.graph.nodes(e.target).OGcolor)
      e.color = e.OGcolor;
  });
} else {
  s.graph.nodes().forEach(function(n) {
    if (n.id != prevNodeID) {
      n.color = n.OGcolor;
      if(n.id != nodeId) {
        n.label = n.name;
      }
    } else {
      n.color = n.OGcolor;
      n.label = "";
    }
  });

  s.graph.edges().forEach(function(e) {
    e.color = e.OGcolor;
  });

  prevNodeID = "";
}

  s.refresh()
}); 
  });