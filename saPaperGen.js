const PDFDocument = require('pdfkit');
const fs = require('fs');
const sizeOf = require('image-size');
const {randomInt} = require('crypto');

const csvReadIn = require('./CSVReading')
const filter = require('./filterByTopics')


/*
    Program flow

    Read in CSV

    Filter by topics
        if there are more than wanted choose random questions 

    Display
*/

module.exports = {

    /*
        mainGenerator
        Creates the PDF
    */
    mainGenerator: async function(numMC, topics) {
        try{
            let doc = new PDFDocument({size: 'A4', margins: {
                top: 50,
                bottom: 50,
                left: 120,
                right: 72
            }});
            
            let position = 50;
            let title = process.argv[2];
        
            doc.pipe(fs.createWriteStream('output.pdf'));
            doc.fontSize(10).font('Courier-Bold').text(title);
            position += 20;
    
            let saquestions = csvReadIn.loadSADataCSV();
            mcquestions = filter.filterByTopic(mcquestions, topics, numMC)
    
            let mcAnswers = [];
            let count = 0;
    
            doc.addPage()
            doc.fontSize(25).font('Courier-Bold').text("Short Answer Solutions")
            position = 75
            saDir = "data/A/AdvSA"

            count = numOfMCQs + 1
            saInfo[0].forEach((question)=>{
                
                for(var i = 0; i < parseInt(question[4]); ++i){
                    let imageNum = (parseInt(question[3]) + i)
                    let url = saDir + "/" + imageNum + ".png"
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

                doc.fontSize(10).text(question[1] + ', ' + question[2] + ". Keywords: " + question[0])

                doc.moveTo(72, position).lineTo(522, position).stroke();

                doc.moveDown()
                position += 25;
                
                count++
            })
            
    
            doc.end();
            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
        
    }
}