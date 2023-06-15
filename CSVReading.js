const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports = {

    /*
        trimQuotes
        @param str - string that may or may not need start & end quotes removed
        @return string without quotes
    */
    trimQuotes: function (str){
        if(str[0] == '"')return str.substring(1, str.length-1);
        else return str;
    },
    
    /*  
        loadMCDataCSV
        @param url - relative URL to the folder where the images + CSV file are
        @return array/list of questions in the format [str: topics, int: questionNumber, str: answer (A,B,C,D)]
    */
    loadMCDataCSV: function (){
        let lines = fs.readFileSync("./Data/MultipleChoice/MCData.csv", 'utf-8')
        let output = [];
    
        lines.split(/\r?\n/).forEach(line =>  {
            let split = line.split(',')
            output.push([this.trimQuotes(split[0]), split[1], this.trimQuotes(split[2])]);
        });
        return output
    },

    /*
        loadSADataCV
        @param url - relative URL to the folder where the Question and Answer folders are
        @param numOfQs - number of short answer questions
        @return array/list of questions in the format [str: topics, int: questionNumber, int: how many subquestions/images are there in this question]

    */
    loadSADataCSV: function (){
        let lines = fs.readFileSync("./Data/ShortAnswer/Q/SAData.csv", 'utf-8')
        let output = [];

        lines.split(/\r?\n/).forEach(line =>  {
            let split = line.split(',')
            output.push([this.trimQuotes(split[0]), split[1], split[2]]);
        });

        return output;
    }

}
