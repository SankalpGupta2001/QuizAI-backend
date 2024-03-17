const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


const { GoogleGenerativeAI } = require("@google/generative-ai");


console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });


async function generateQuestionsDirectly({ NumMCQ, NumFIB, NumMatching, NumSubjective, NumTF, MCQDifficulty, FIBDifficulty, MatchingDifficulty, TFDifficulty, SubjectiveDifficulty, MCQChecked, FIBChecked, TFChecked, MatchingChecked, SubChecked, Curriculum, GradeLevel, Topics, SubTopics, Subject }) {

  if (!Curriculum || !Topics || !SubTopics || !GradeLevel || !Subject) {
    return res.status(400).json({ status: "ERROR", message: "All fields are required" });
  }

  const prompt = `Hi I'm ${Subject} teacher and I want good quality of questions for my Quiz , So Generate Questions for Class ${GradeLevel} students studying ${Curriculum} curriculum. The questions should be focus on the topic '${Topics}' with a subtopic of '${SubTopics}'. 

    ${MCQChecked ? `Please Generate  ${NumMCQ} set of questions of multiple-choice type (MCQs) of ${MCQDifficulty} Difficulty Level` : ""}
    ${FIBChecked ? `Please Generate ${NumFIB} set of questions of  Fill in the Blanks type of ${FIBDifficulty} Difficulty Level` : ""}
    ${MatchingChecked ? `Please Generate ${NumMatching} set of questions of Matching type  of ${MatchingDifficulty} Difficulty Level` : ""}
    ${TFChecked ? `Please Generate ${NumTF} set of questions of True or False type  of ${TFDifficulty} Difficulty Level` : ""}
    ${SubChecked ? `Please Generate ${NumSubjective} set of questions of Subjective type of ${SubjectiveDifficulty} Difficulty Level` : ""}

   For example ,Below is the structure of JSON of all sets of type of questions.

   [
        {
          "QuestionType": "MCQ",
          "Prompt": "What is the chemical symbol for water?",
          "Answer": "H2O",
          "Options": [
            "H",
            "O2",
            "H2O",
            "CO2"
          ],
          "Feedback": "Correct! The chemical symbol for water is H2O, representing two hydrogen atoms and one oxygen atom."
        },
        {
          "QuestionType": "MCQ",
          "Prompt": "Which planet is known as the Red Planet?",
          "Answer": "Mars",
          "Options": [
            "Venus",
            "Mars",
            "Jupiter",
            "Saturn"
          ],
          "Feedback": "Correct! Mars is known as the Red Planet due to its reddish appearance caused by iron oxide, or rust, on its surface."
        },
        {
          "QuestionType": "TrueorFalse",
          "Prompt": "The Sun is a planet.",
          "Answer": "False",
          "Feedback": "Correct! The Sun is a star, not a planet. It is the largest object in our solar system and contains about 99.8% of the total mass of the entire solar system."
        },
        {
          "QuestionType": "TrueorFalse",
          "Prompt": "Water boils at 100 degrees Celsius.",
          "Answer": "True",
          "Feedback": "Correct! Water boils at 100 degrees Celsius under normal atmospheric pressure. This is the boiling point of water at sea level."
        },
        {
          "QuestionType": "FillintheBlanks",
          "Prompt": "The chemical formula for table salt is _________.",
          "Answer": "NaCl",
          "Feedback": "Correct! The chemical formula for table salt is NaCl (sodium chloride), which is composed of one sodium ion (Na+) and one chloride ion (Cl-)."
        },
        {
          "QuestionType": "FillintheBlanks",
          "Prompt": "The process of converting light energy into chemical energy in plants is called _________.",
          "Answer": "Photosynthesis",
          "Feedback": "Correct! Photosynthesis is the process by which green plants and some other organisms convert light energy into chemical energy, producing oxygen and organic compounds like glucose."
        },
        {
          "QuestionType": "Matching",
          "Prompt": "Match the following programming languages with their primary use:",
          "LeftCol": ["Python", "C++", "HTML"],
          "RightCol": ["Web development", "General-purpose programming", "Markup language"],
          "Answer": {
            "Python": "General-purpose programming",
            "C++": "General-purpose programming",
            "HTML": "Markup language"
          },
          "Feedback": "Correct matches: Python - General-purpose programming, C++ - General-purpose programming, HTML - Markup language."
        },
        {
          "QuestionType": "Matching",
          "Prompt": "Match the following scientists with their contributions:",
          "LeftCol": ["Isaac Newton", "Albert Einstein", "Marie Curie"],
          "RightCol": ["Theory of General Relativity", "Law of Universal Gravitation", "Radioactivity"],
          "Answer": {
            "Isaac Newton": "Law of Universal Gravitation",
            "Albert Einstein": "Theory of General Relativity",
            "Marie Curie": "Radioactivity"
          },
          "Feedback": "Correct matches: Isaac Newton - Law of Universal Gravitation, Albert Einstein - Theory of General Relativity, Marie Curie - Radioactivity."
        },
         {
          "QuestionType": "Subjective",
          "Prompt": "Explain the greenhouse effect and its impact on climate change.",
          "Answer": "The greenhouse effect is a natural process where greenhouse gases trap heat from the sun in the Earth's atmosphere, leading to an increase in temperature. However, human activities such as burning fossil fuels and deforestation have intensified the greenhouse effect, causing global warming and climate change.",
          "Feedback": "Your explanation provides a clear understanding of the greenhouse effect and its consequences on climate change. You've highlighted both the natural process and the human-induced factors contributing to its intensification."
        },
        {
          "QuestionType": "Subjective",
          "Prompt": "Discuss the significance of the Industrial Revolution in shaping modern society.",
          "Answer": "The Industrial Revolution marked a significant shift in human history, leading to the mechanization of production, urbanization, and technological advancements. It transformed economies from agrarian to industrial, created new social classes, and laid the foundation for modern capitalism. However, it also brought about environmental degradation, labor exploitation, and social inequalities.",
          "Feedback": "Your discussion highlights the multifaceted impact of the Industrial Revolution on society, addressing both its positive and negative consequences. You've provided insights into its economic, social, and environmental implications."
        },
      ]

    Alert Points While Making JSON : 
    1) Please be alert while making the JSON that curly brackets {} and square brackets [] and inverted commas "" and commas , and correctly configured in the JSON. 
    2) Please be alert that make questions in javascript object form and add in the one array so that all question will in Single JSON as given above in example 
    3) Please be alert that whatever type of question ask to find Please give that only as in the above Example there are other types are also provided so give JSON for that type of question which has been asked .Please also be alert that Number of questions ask for each type of question which was asked will be exact in the repsonse . Please ensure that the questions are in same format as written above and are clear, concise, and cover a all range of concepts within the specified topic and subtopic.`

  console.log(prompt, "prompt");
  const result = await model.generateContent(prompt);
  let response = await result.response;
  response = await response.text();
  console.log(response);

  const startIndex = response.indexOf('[');
  const endIndex = response.lastIndexOf(']');
  if (startIndex !== -1 && endIndex !== -1) {
    let responseText = response.toString();
    let jsonString = responseText.substring(startIndex, endIndex + 1);

    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    console.log(jsonString);
    return jsonString;
  }
  else {
    console.error('JSON object not found in the response');
  }




}




app.post("/generate-questions", async (req, res) => {
  try {
    const params = req.body;
    console.log(params, "params");
    const questions = await generateQuestionsDirectly(params);
    res.json({ "quiz_title": params.Topics, questions: questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/", (req, res) => {
  res.send("hi");
});



app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});

