const fs = require('fs')

const csv = require('./CSVReading.js')
const filter = require('./filterByTopics.js')
const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');

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

/*
    MCQuestions
    @param questions - list of  multiple choice questions
    @param doc - the pdf document that will be added on
    @return - the list of question answers
*/
function MCQuestions(mcquestions, doc){
    try{

        let position = 50;
        let title = process.argv[2];
    
        doc.pipe(fs.createWriteStream('output.pdf'));
        
        position += 20;


        let mcAnswers = [];
        let count = 0;

        mcquestions.forEach(question => {
            mcAnswers.push(question[2]);
            
            let imageURL = "Data/MultipleChoice/" + question[1] + ".png";
 
        
            let dimensions = sizeOf(imageURL);

            let multiplier = 350/dimensions.width;

            if(position + dimensions.height * multiplier + 25 > 800){
                doc.addPage({size: 'A4', margins: {
                    top: 50,
                    bottom: 50,
                    left: 120,
                    right: 72
                }});
                position = 50;
            }
            
            doc.fontSize(10).font('Courier-Bold').text("Question " + (count + 1));
            position += 4;

            doc.image(imageURL, {width:350, align: 'center'});
            position += dimensions.height * multiplier;

            doc.moveTo(72, position).lineTo(522, position).stroke();
            position += 25;
            
            doc.moveDown() ;
            count++;

        });
        return mcAnswers;
    }
    catch(err){
        console.log(err)
        console.log("Error Making Multiple Choice");
    }
}

function MCAnswers(answers, doc){
    //--------------------------ANSWERS
    doc.addPage()
    doc.fontSize(25).font('Courier-Bold').text("Multiple Choice Answers")
    position = 75;
    answers.forEach((e, index)=>{
        if(position + 15 > 850){
            doc.addPage()
            position = 50
        }
        let str = (index + 1) + ": " + e;
        doc.fontSize(15).text(str)
    })
}

function SAQuestions(saquestions, doc){

}

function SAAnswers(saquestions, doc){
    
}

function paperGen(settings){
    
    let MC = settings[0] > 0;
    let SA = settings[1] > 0;

    let mcanswers;
    if(!MC && !SA)return;
    else{
        var doc = new PDFDocument({size: 'A4', margins: {
            top: 50,
            bottom: 50,
            left: 120,
            right: 72
        }});
        doc.fontSize(10).font('Courier-Bold').text(process.argv[2]);
    }

    if(MC){
        let mcquestions = csv.loadMCDataCSV();
        mcquestions = filter.filterByTopic(mcquestions, settings[2], settings[0]);
        mcanswers = MCQuestions(mcquestions, doc);
    }

    if(SA){
        if(MC)doc.addPage();

        let saquestions = getquestions
        SAQuestions(saquestions, doc)
    }

    if(MC){
        MCAnswers(mcanswers, doc);
    }

    if(SA){
        SAAnswers
    }
    
    doc.end();
}

function main(){
    let settings = readInSettings();  
    let finished = true;
    
    paperGen(settings)
    if(finished)console.log("Paper \"" + process.argv[2] + "\" Created");
    else console.log("Paper could not be created");

}

main();