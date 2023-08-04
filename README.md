# Pega Data Model Visualization
<img src="https://github.nfcu.net/Business-Process-Automation-Innovation/Data-Model-Vis/blob/Dev/Imgs/banner.png" width="700"/>
 
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/https%3A%2F%2Fgithub.nfcu.net%2FD2446/https%3A%2F%2Fgithub.nfcu.net%2FBusiness-Process-Automation-Innovation%2FData-Model-Vis)

The Pega Data model web application takes in metadata (JSON or CSV) from Pega database and uses it to create a graph. During the graph creation process data objects are related to each other using parameters defined in the metadata and some not present in the metadata.

## Features
* File upload
* Zoom in/ Zoom out
* Search for node
* Highlight node neighbors 
* Fruchterman Reingold layout (smart positioning of nodes)
* Custom tooltip/label support 

## Usage
To use the web application, click on the following link: https://github.nfcu.net/pages/Business-Process-Automation-Innovation/Data-Model-Vis/

1. Press the information button in the bottom left of the screen <img src="https://github.nfcu.net/Business-Process-Automation-Innovation/Data-Model-Vis/blob/Dev/Imgs/18623.png" width="15" height="15" />. Read the instructions and then copy and use on the Pega SQL database. (**Note:** The command can be modified to get information from different classes)
2. Press the upload button <img src="https://github.nfcu.net/Business-Process-Automation-Innovation/Data-Model-Vis/blob/Dev/Imgs/2810455.png" width="15" height="15" /> and upload the file you fetched from the Pega SQL database. Currently, only JSON format is supported for file upload.
3. Press the submit button <img src="https://github.nfcu.net/Business-Process-Automation-Innovation/Data-Model-Vis/blob/Dev/Imgs/54795.png" width="15" height="15" /> and let the program generate the graph! Browser timeout might occur at this stage. Just ignore the message to reload/kill the page. The layout algorithm causing this timeout is being worked on the be improved. 

For development, just fork the repository and follow standard GitHub practices. Files inside of the repo have comments explaining functions and variables. 

## Additional Info
This project is using the graph display library called Sigma.js. Read about the library on the library page. The version of Sigma.js used in this project is old and does not have features available in the latest version of Sigma.js. This is primarily since npm and Node.js was not allowed on NFCU devices (or at least on the interns). As a result, many items in this project had to be built from the ground up. If npm and Node.js is used in the future with this project, development can be faster, easier, and more efficient. 

Also do not import **@baseclass** meta data with this version. It will eventually generate a graph but will be very slow in doing so. When the layout algorithm issue is fixed, this text should be removed. 

## Contributors
* [Manas Pandey](https://github.nfcu.net/D2446)
