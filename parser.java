import java.io.*;
import java.util.*; 

/*
 * This parser is not in use anymore since everything is handled on the front end now. 
 * It can be used to do backend parsing when client server structure is made for this application.
 */

public class parser {

    public static String PRIM_COLOR = "#0474BA";
    public static String CLASS_COLOR = "#F17720";
    public static String CLASS_LINK_COLOR = "#003f5c";
    public static String PRIM_LINK_COLOR = "#58508d";
    
    static Boolean doesItExist(String LookingForThis, List<Node> nodeArray) {
        for (int i = 0; i < nodeArray.size(); i++) {
            if (nodeArray.get(i).NodeName.equals(LookingForThis)) {
                return true;
            }
        }
        return false;
    }

    static Integer findIndexOfNode(String LookingForThis, List<Node> nodeArray) {
        for (int i = 0; i < nodeArray.size(); i++) {
            if (nodeArray.get(i).NodeName.equals(LookingForThis)) {
                return i;
            }
        }
        return -1;
    }

    static Integer nodeSize(String pram) {
        if (!pram.equals("String")) {
            return 23;
        }
        return 15;
    }

    static String nodeColor(String pram) {
        if (!pram.equals("String")) {
            return CLASS_COLOR;
        }

        return PRIM_COLOR;
    }

    static String replaceIllegalChars(String pram) {
        String ret = pram;
        ret.replace("\"", "");
        ret.replace(",", " ");
        return ret;
    }
    
    public static void main(String[] args) throws FileNotFoundException, IOException {
        //Replace File hard path with the upload functionality when it is ready
        File file = new File("input.csv");
        FileReader fr = new FileReader(file);
        BufferedReader br = new BufferedReader(fr);
        String line = "";

        //This  is interperting/transformation code
        List<Node> nodeArray = new ArrayList<Node>();
        List<Link> linkArray = new ArrayList<Link>();

        String[] tempArr;
        while((line = br.readLine()) != null) {
            tempArr = line.split(",");
            
            //Replace this with a more dynamic way to deal with commas and breakpoints in name category in csv files
            if (tempArr.length == 9) {
                Node tmpNode = new Node(tempArr[0], tempArr[1], tempArr[2], tempArr[3], tempArr[4], tempArr[5], tempArr[6], replaceIllegalChars(tempArr[7]), replaceIllegalChars(tempArr[8]), nodeSize(tempArr[2]), nodeColor(tempArr[2]));
                nodeArray.add(tmpNode);
            } else {
                Node tmpNode = new Node(tempArr[0], tempArr[1], tempArr[2], tempArr[3], tempArr[4], tempArr[5], tempArr[6], replaceIllegalChars(tempArr[7]), replaceIllegalChars(tempArr[9]), nodeSize(tempArr[2]), nodeColor(tempArr[2]));
                nodeArray.add(tmpNode);
            }
        }

        br.close();
        nodeArray.remove(0);

        /*for (int i = 0; i < nodeArray.size(); i++) {
            System.out.println(nodeArray.get(i).NodeName);
        }*/

        //exception handling for when a node the is suppose to connect does not exist. Temp solution.
        int minusI = 0;
        for (int i = 0; i < nodeArray.size() - minusI; i++) {
            if (!doesItExist(nodeArray.get(i).appliesTO, nodeArray)) {
                Node tmpNode = new Node(nodeArray.get(i).appliesTO);
                tmpNode.NodeSize = 23;
                tmpNode.NodeColor = CLASS_COLOR;
                nodeArray.add(tmpNode);
                minusI++;
            } 
            
            if (!doesItExist(nodeArray.get(i).PageClass, nodeArray) && !nodeArray.get(i).PageClass.equals("NULL") && !nodeArray.get(i).PageClass.equals("class")) {
                Node tmpNode = new Node(nodeArray.get(i).PageClass);
                tmpNode.NodeSize = 23;
                tmpNode.NodeColor = CLASS_COLOR;
                nodeArray.add(tmpNode);
                Link tmpLink = new Link("p"+ i,  i, nodeArray.size()-1, CLASS_LINK_COLOR, nodeArray.get(i).StringType, 6);
                linkArray.add(tmpLink);
                minusI++;
            }

        }

        for (int i = 0; i < nodeArray.size(); i++) {
            if (doesItExist(nodeArray.get(i).appliesTO, nodeArray)) {
                String type1 = "";
                String type2 = nodeArray.get(i).NodeType;

                for (int j = 0; j < nodeArray.size(); j++) {
                    if (nodeArray.get(j).NodeName.equals(nodeArray.get(i).NodeType)) {
                        type1 = nodeArray.get(j).NodeType;
                    }
                }
                if (type1.equals("String") || type2.equals("String")) {
                    Link tmpLink = new Link("l"+ i, i, findIndexOfNode(nodeArray.get(i).appliesTO, nodeArray), PRIM_LINK_COLOR, nodeArray.get(i).StringType, 4);
                    linkArray.add(tmpLink);
                } else {
                    Link tmpLink = new Link("l"+ i,  i, findIndexOfNode(nodeArray.get(i).appliesTO, nodeArray), CLASS_LINK_COLOR, nodeArray.get(i).StringType, 6);
                    linkArray.add(tmpLink);
                }
            } else if (doesItExist(no, nodeArray)) {
                //better exception handeling here eventually
            }
        }

        //Links between classes not specified on SQL data
        for (int i = 0; i < nodeArray.size(); i++) {
            String currNode = nodeArray.get(i).NodeName;
            String type = nodeArray.get(i).StringType;
            String[] currNodeParts = currNode.split("-");

            for (int j = i + 1; j < nodeArray.size(); j++) {
                String otherNode = nodeArray.get(j).NodeName;
                String[] otherNodeParts = otherNode.split("-");
                
                if ((otherNode.contains(currNode) || currNode.contains(otherNode)) && Math.abs(otherNodeParts.length - currNodeParts.length) == 1) {
                    Link tmpLink= new Link("nl"+ j + i + 1, findIndexOfNode(currNode, nodeArray), findIndexOfNode(otherNode, nodeArray), CLASS_LINK_COLOR, type, 6);
                    linkArray.add(tmpLink);
                }
            }
        }

        for (int i = 0; i < linkArray.size(); i++) {
            System.out.println(linkArray.get(i).source + " " + linkArray.get(i).destination);
        }

        //File exporter
        FileWriter NodeWriter = new FileWriter("data.js");
        NodeWriter.write("var graph2 = {\nnodes: [\n");
        for (int i = 0; i < nodeArray.size(); i++) {
            NodeWriter.write("{id: \"" + i + "\", label: \"" + nodeArray.get(i).NodeName + "\", name: \"" + nodeArray.get(i).NodeName + "\", tooltip: \"" + nodeArray.get(i).NodeName + "<br>Node type: " + nodeArray.get(i).NodeType + "<br>Page class: " + nodeArray.get(i).PageClass + "<br>String type: " + nodeArray.get(i).StringType + "<br>Version: " + nodeArray.get(i).Version + "<br>UpdateDateTime: " + nodeArray.get(i).UpdateDateTime + "<br>Rule: " + nodeArray.get(i).Rule + "\", x: "+ Math.random() * 5000 + ", y: " + Math.random() * 5000 + ", size: " + nodeArray.get(i).NodeSize + ", OGcolor: \"" + nodeArray.get(i).NodeColor + "\", color: \"" + nodeArray.get(i).NodeColor + "\"},\n");
        }
        NodeWriter.write("],\n");
        NodeWriter.write("edges: [\n");
        for (int i = 0; i < linkArray.size(); i++) {
            NodeWriter.write("{id: \"" + linkArray.get(i).id + "\", source: \"" + linkArray.get(i).source + "\", target: \"" + linkArray.get(i).destination + "\", OGcolor: \"" + linkArray.get(i).color + "\", color: \"" + linkArray.get(i).color + "\", type: \"arrow\", size: \"" + linkArray.get(i).size + "\"},\n");
        }
        NodeWriter.write("]\n}");
        NodeWriter.close();
    }
}