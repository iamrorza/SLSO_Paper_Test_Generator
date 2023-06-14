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
    mainGenerator: async function(numSA, topics) {
        try{
            var doc = new PDFDocument({size: 'A4', margins: {
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
            saquestions = filter.filterByTopic(saquestions, topics, numSA)
    

            let SADir = "./Data/ShortAnswer/";
            let count = 1;
    
            position = 75
            
            console.log(saquestions)
            
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
            //------------------------------SHORT ANSWER SOLUTIONS
            doc.addPage();
            doc.fontSize(25).font('Courier-Bold').text("Short Answer Solutions")

            count = 1;
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
            
    
            doc.end();
            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
        
    }
}