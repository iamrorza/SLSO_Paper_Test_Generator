

/*
    setOfQuestionNumbers
    @param numberOfQuestions - sets the size of the set
    @param maxNumber - max number that can be contained in the set
    @return set of numbers of size numberOfQuestions that can contain ints from 1 - maxNumber

    ASSUMES maxNumber > numberOfQuestions otherwise will be infinite loop
*/
function setOfQuestionNumbers(maxNumber, numberOfQuestions  ){

    let set = new Set();
    while(set.size != numberOfQuestions){
        let number = Math.ceil(Math.random() * maxNumber);

        if(!set.has(number)){
            set.add(number);
        }
    }
    
    return set;
}

module.exports = {

    /*
        filterByTopic
        @param questions - list of questions
        @param topics - list of strings that are the topics that the user want to filter by
        @param numOfQs - number of questions desired
        @return list of questions. Length of 'numOfQs'. 
    */
    filterByTopic: function(questions, topics, numOfQs){
        let questionArray = [];
        if(topics.length == 0){
            questionArray = questions;
        }
        else {

            for(let question in questions){

                let added = false;
    
                for(let topic in topics){
                    if(!added && questions[question][0].includes(topics[topic])){
                        questionArray.push(questions[question]);
                        added = true;
                    }
                }
            }
        }
        
        if(questionArray.length <= numOfQs)return questionArray;

        let setOfQNum = setOfQuestionNumbers(questionArray.length, numOfQs);
        
        let newQuestionArray = [];
        setOfQNum = Array.from(setOfQNum)

        for(let num in setOfQNum){
            newQuestionArray.push(questionArray[setOfQNum[num]]);
        }
        return newQuestionArray;
    }
}