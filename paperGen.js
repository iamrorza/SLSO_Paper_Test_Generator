const fs = require('fs')

const csv = require('./CSVReading.js')
const filter = require('./filterByTopics.js')
const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const { error } = require('console');

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

/*
    MCAnswers
    @param answers - list of answers for the multiple choice
    @param doc - pdf doc that is being edited
*/
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

/*
    SAQuestions
    @param saquestions - short answer questions that are going to be put on the pdf
    @param doc - pdf doc that is being edited
    @param numMC - number of MC questions, so that the count is continuous
*/
function SAQuestions(saquestions, doc, numMC){
    let position = 50;
    let title = process.argv[2];


    doc.fontSize(10).font('Courier-Bold').text(title);
    position += 20;


    let SADir = "./Data/ShortAnswer/";
    let count = 1 + numMC;

    position = 75
    
    
    saquestions.forEach((question) =>{
        for(var i = 0; i < parseInt(question[2]); ++i){

            let imageNum = (parseInt(question[1]) + i);
            let url = SADir + "Q/" + imageNum + ".png";
            const dimensions = sizeOf(url)
            let multiplier = 350/dimensions.width;

            if(position + dimensions.height * multiplier + 25 > 800){
                doc.addPage();
                position = 59;
            }
            if(i == 0){
                doc.fontSize(10).font('Courier-Bold').text("Question " + (count))
                position += 20
            }
            doc.image(url, {align: 'center', width:350})
            position += dimensions.height * multiplier;
            
            doc.moveDown()
            position += 10;

            
        }
        ++count;
    })
}

/*
    SAAnswers
    @param saquestions - short answer answers that are going to be put on the pdf
    @param doc - pdf doc that is being edited
    @param numMC - number of MC questions, so that the count is continuous
*/
function SAAnswers(saquestions, doc, numMC){
    doc.addPage();
    doc.fontSize(25).font('Courier-Bold').text("Short Answer Solutions")

    let SADir = "./Data/ShortAnswer/";

    count = 1 + numMC;
    saquestions.forEach((question)=>{
        for(var i = 0; i < parseInt(question[2]); ++i){

            let imageNum = (parseInt(question[1]) + i);
            let url = SADir + "A/" + imageNum + ".png";
            const dimensions = sizeOf(url)
            let multiplier = 350/dimensions.width;

            if(position + dimensions.height * multiplier + 25 > 800){
                doc.addPage();
                position = 59;
            }
            if(i == 0){
                doc.fontSize(10).font('Courier-Bold').text("Question " + (count))
                position += 20
            }
            doc.image(url, {align: 'center', width:350})
            position += dimensions.height * multiplier;
            
            doc.moveDown()
            position += 10;

            
        }
        ++count;
    })
}

function paperGen(settings){
    
    try{
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

        let mcquestions;
        if(MC){
            mcquestions = csv.loadMCDataCSV();
            mcquestions = filter.filterByTopic(mcquestions, settings[2], settings[0]);
        }

        let saquestions;
        if(SA){
            saquestions = csv.loadSADataCSV();
            saquestions = filter.filterByTopic(saquestions, settings[2], settings[1]);
        }

        if(MC){
            mcanswers = MCQuestions(mcquestions, doc);
        }

        if(SA){
            if(MC)doc.addPage();

            SAQuestions(saquestions, doc, settings[0]);
        }

        if(MC){
            MCAnswers(mcanswers, doc);
        }

        if(SA){
            SAAnswers(saquestions, doc, settings[0]);
        }
        
        doc.end();
    }
    catch(err){
        console.log(err);
        throw error;
    }
    
}

function main(){
    let settings;
    try{
        settings = readInSettings(); 
    }
    catch(err){
        console.log("Settings could not be read");
    }
     
    
    try{
        paperGen(settings);
    }
    catch(err){
        console.log("Paper could not be created");
    }

}

main();