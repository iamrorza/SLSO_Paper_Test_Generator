const PDFDocument = require('pdfkit');
const fs = require('fs');
const sizeOf = require('image-size');

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
    
            let mcquestions = csvReadIn.loadMCDataCSV();
            mcquestions = filter.filterByTopic(mcquestions, topics, numMC)
    
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
    
    
            //--------------------------ANSWERS
            doc.addPage()
            doc.fontSize(25).font('Courier-Bold').text("Multiple Choice Answers")
            position = 75;
            mcAnswers.forEach((e, index)=>{
                if(position + 15 > 850){
                    doc.addPage()
                    position = 50
                }
                let str = (index + 1) + ": " + e;
                doc.fontSize(15).text(str)
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