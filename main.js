const { constants } = require("buffer");
let fs = require("fs");
let path = require("path");

let inputArray = process.argv.slice(2);
let command = inputArray[0];

switch (command) {
    case "help":
        help();
        break;
    case "organize":
        organize();
        break;
    case "tree":
        tree(inputArray[1]);
        break;
    default:
        break;
}

function organize() {
}

function tree(src) {
    // 1. take path input from user
    if (src == undefined) {
        src = process.cwd(); // if path not specified -> current working directory will be the default path
    }
    if (fs.existsSync(src)) {
        treeHelper(src, " ");
    } else {
        console.log("please specify the correct path");
    }
}

function treeHelper(dirPath, indent) {
    // 2. check for file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile) {
        let fileName = path.basename(dirPath); // if file -> print file name.
        console.log(indent + "├──" + fileName);
    }
    else {
        // if folder
        dirName = path.basename(dirPath); // get directory name
        console.log(indent + "└──" + dirName);

        let children = fs.readdirSync(dirPath); // get array for all the files/folder
        for (let i = 0; i < children.length; i++) {
            let childPath = path.join(dirPath, children[i]);
            treeHelper(childPath, indent + "\t"); // recurse the function to check for each directory
        }

    }
}

function help() {
    console.log(`
    List of all commands - 
        node main.js help
        node main.js tree "directory path"
        node main.js organize "directory path"
    `);
}