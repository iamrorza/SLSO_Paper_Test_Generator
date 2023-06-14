const fs = require('fs')
const mcgen = require('./mcPaperGen.js')

function readInSettings(){
    let lines = fs.readFileSync('./settings.txt', 'utf-8')
    let count = 0;

    let numMC = 10;
    let numSA = 20;
    let topics = [];

    lines.split(/\r?\n/).forEach(line => {
        if(count == 1){
            try{
                numMC = Number(line);
            }
            catch(error){
                console.log(error);
                console.log("Could not generate PDF");
            }
        } else if(count == 3){
            try{
                numSA = Number(line);
            }
            catch(error){
                console.log(error);
                console.log("Could not generate PDF");
            }
        } else if(count >= 5){
            topics.push(line);
        }

        ++count;
    });
    return [numMC, numSA, topics];
}

function main(){
    let settings = readInSettings();  
    let finished = true;
    if(settings[0] == 0 && settings[1] > 0){
        //SHORT ANSWER
    }
    else if(settings[0] > 0 && settings[1] == 0){
        finished = mcgen.mainGenerator(settings[0], settings[2]);
    }
    else{
        //BOTH
    }

    if(finished)console.log("Paper \"" + process.argv[2] + "\" Created");
    else console.log("Paper could not be created");

}

main();