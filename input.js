#!/usr/bin/env node
const { dir, Console } = require("console");
let fs = require("fs");
const path = require("path");
let types =  {
    media: ["mp4", "mkv"],
    pictures: ["jpg", "png", "jpeg"],
    songs: ["mp3"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"],
    recordings: ["3gpp"]
}
// npm init -y
// cmd  
// "bin": {
// "scrunchie" : "input.js"
// }
// npm link
// scrunchie help
// scrunchie tree

let inputArray = process.argv.slice(2);
console.log(inputArray)

// node input.js tree "directoryPath"
// node input.js organise "directoryPath"
// node input.js help

let command  = inputArray[0];
switch(command){
    case "tree":
        treeFun(inputArray[1]);
        break;
    case "organise":
        organiseFun(inputArray[1])
        break;
    case "help":
        helpFun(inputArray[1])
        break;
    default:
        console.log("please🙏 input right command")           
}


function treeFun(dirPath) {
    if (dirPath == undefined) {

        treeHelper(process.cwd(), "");
        return;
    } else {
        let pathExist = fs.existsSync(dirPath);
        if (pathExist) {
            treeHelper(dirPath, "");
        } else {

            console.log("Kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    } 
    else {
        let dirName = path.basename(dirPath)
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }


}


function organiseFun(dirPath){
    let destPath;
    // 1. input --> directory path given
    if(dirPath == undefined){
        destPath = process.cwd();
        console.log("Kindly enter the path ");
        return;

    }
    else{
        let pathExist = fs.existsSync(dirPath);
        if(pathExist){
            // 2. create --> organise files -> directory 
            destPath = path.join(dirPath, "organised_files");
            if(!fs.existsSync(destPath)){
                fs.mkdirSync(destPath);
            }
            
        }
        else{
            console.log("Kindly enter the path") ;
            return;
        }
    }

    organiseHelper(dirPath, destPath);
    
    
    
    console.log("organise command implemented", dirPath)
}

// HELP
function helpFun(dirPath){
    console.log(`
    List of all the commands:
                node input.js tree "directoryPath"
                node input.js organise "directoryPath"
                node input.js help
    `)
}

function organiseHelper(src, dest){
    // 3. identify categories of all the files present in that directory
    let childName = fs.readdirSync(src);
    // console.log(childName);
    for(let i =0; i<childName.length; i++){
        let childAddress = path.join(src, childName[i] );
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childName[i]);
            let category = getCategory(childName[i]);
            console.log(childName[i], " belongs to --> ", category)
            // 4. copy or cut files to that organised directory of any category folder
            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category){
    let categoryPath = path.join(dest, category);
    if( !fs.existsSync(categoryPath)){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName, " copied to ", category);
}



function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1)
    console.log(ext)
    for(let type in types){
        let typeArray = types[type];

        for(let i =0; i<typeArray.length; i++){
            if(ext == typeArray[i]){
                return type;
            }
            
        }
    }
    return "other type"
}