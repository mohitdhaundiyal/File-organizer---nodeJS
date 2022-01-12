const { constants } = require("buffer");
let fs = require("fs");
let path = require("path");

let inputArray = process.argv.slice(2);
let command = inputArray[0];

let types = {
    media: ["mp4", "mkv", "mp3"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

switch (command) {
    case "help":
        help();
        break;
    case "organize":
        organize(inputArray[1]);
        break;
    case "tree":
        tree(inputArray[1]);
        break;
    default:
        break;
}

function organize(src) {
    let destPath;
    // 1. take the source directory as input
    if (src == undefined) {
        src = process.cwd(); // if directory path is not defined - current working directory will be the default one
    }

    // 2. if src is valid we create an organized_file folder in that directory
    if (fs.existsSync(src)) {
        destPath = path.join(src, "organize_files");
        if (fs.existsSync(destPath) == false) {
            fs.mkdirSync(destPath);
        }
        organizeHelper(src, destPath);
    } else {
        console.log("please specify the correct path");
    }
}

function organizeHelper(source, destination) {
    // 3. identify category of each file
    let children = fs.readdirSync(source);
    // console.log(children);
    for (let i = 0; i < children.length; i++) {
        // get extention of each file - 
        let childAdress = path.join(source, children[i]);
        // check if childAddress is file or folder
        // console.log(childAdress)
        let isFile = fs.lstatSync(childAdress).isFile();
        if (isFile) {
            let category = getExtention(childAdress[i]);
            // console.log(category);
            sendFile(childAdress, destination, category);
        }
        // console.log(children[i]);
    }
}

function getExtention(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    // console.log(ext);
    for (let type in types) {
        let typeArray = types[type];
        for (let i = 0; i < typeArray.length; i++) {
            if (ext == typeArray[i]) {
                return type;
            }
        }
        return "others";
    }
}

function sendFile(fileAddress, destinationOfFile, category) {
    // 4. send file to respective category folder
    // create category path
    let categoryPath = path.join(destinationOfFile, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }

    // note : in order of copy/cut file - first you need to create duplicate file in destination folder.
    let fileName = path.basename(fileAddress);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(fileAddress, destFilePath);

    // fs.unlinkSync(srcFilePath); // to cut the file
    console.log(fileName, "copied to --------> ", category);
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