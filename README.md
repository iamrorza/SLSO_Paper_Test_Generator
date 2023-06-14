# HSC Test Paper Generator Framework

This is an easy way to generate test papers for HSC students. 

## SETUP

### Data folder

In order to setup the application, there need to be images in the data folder for the multiple choice and short answer, as well as a .csv file in each respective folder. 

#### Images

To set up the multiple choice, images of the questions must be placed in the multiple choice folder. These should be named a unique number and be PNG images. 

For the short answer questions, questions should be labelled by unique numbers and be PNG images. As short answer questions can have multiple subquestions, these subquestions should be named consecutive numbers. 
For the respective answers for all of these questions, they should be labelled the same number.
#### CSV File

For each of the multiple choice and short answer, there should be a CSV file containing all of the information within the folders "Data/MultipleChoice/", and "Data/ShortAnswer/Q/" . These should be called "MCData.csv" and "SAData.csv".

##### MCData.csv

Each line should be a respective question and should be formatted: "TOPICS", IMAGE_NUMBER,"ANSWER"

##### SAData.csv

Each line should be a respective question and should be formatted: "TOPICS", IMAGE_NUMBER, NUMBER_OF_SUBQUESTIONS

### Settings.txt file

Line 2 is the amount of multiple choice questions.
Line 4 is the amount of short answer questions.
Lines 6+ should be any topics that want to be included in the PDF.

## HOW TO USE

In the terminal, traverse to the SLSO_PRACTICE_TEST folder (using the cd command)

Use the command **npm paperGen.js "TITLE"** where __TITLE__ is whatever you want to be on the front page. 