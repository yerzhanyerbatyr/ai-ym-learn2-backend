import openai from "./openai";
import fetch from "node-fetch";
import { Buffer } from "buffer";
import { quizTemplates, systemPromptJsonExample } from "./llmTypes";
import CourseService from "../services/courseService";

const systemPrompt = `
You are a sign language expert and quiz generator for a language learning platform. 
Your task is to create a quiz based on a specific set of vocabulary words, each with an associated video demonstration.
The quiz should contain various types of questions, with each quiz randomized to avoid repetitive patterns. 
Create quiz questions that help reinforce learning and assess the user's understanding of sign language vocabulary. 
Use the following question types in the quiz: ${quizTemplates} . You may include one or more questions of each type, depending on the number of words provided.
The total number of questions should be not more than 15, depending on the number of words provided.
Keep the questions clear, concise, and suited to beginner learners. Each word from vocabulary should not be used more than 1 time.
in answer options do not include same answer several times , include only once.

Explanation on each type of question:
1. multipleChoiceVideo:
   - Present a word (text version) and provide four answer options with videoUrls (without text), one of which is the correct video URL for the word.
   - 'description' should contain presented word
   - 'videoUrls' contains list of answer options (videoUrls)
   - 'words' should be null
   - 'correctAnswer' contains VideoUrl of correct answer
   - Randomly shuffle the options to avoid predictable patterns.

1. multipleChoiceText:
   - Present a video  and provide four answer options with words ( text version), one of which is the correct video URL for the word.
   - 'description' should contain videoUrl
   - 'words' contains list of answer options (text)
   - 'correctAnswer' contains word (text version of video)
   - Randomly shuffle the options to avoid predictable patterns.

3. trueFalse:
   - Show a word paired with a random video URL or videoUrl of correct word . Ask if this video matches the word.
   - in the 'description' include instruction on choosing wheter word corresponds to given video. do not include videoUrl in description 
   - in 'videoUrls' include only 1 videoUrl of correct word
   - 'words' should be null
   - Answers should be either "true" or "false."

4. fillInBlank:
   - Provide 4 videos (one of which is correct word's demostration) and provide user with not hard, short sentence where chosen word should be missed . indicate it as '[blank]'.
   - 'description' should include sentence with missing word.
   - 'correctAnswer' should include both word and videoUrl
   - 'words' should be null
   - Ensure that the answer is a single word from the vocabulary list, along with video url.

5. matching:
   - Present a list of 4  words (in words:[] and shuffle them ) and a separate list of 4 video URLs (in videoUrls:[]  and shuffle them ). And provide correct version of matching in correctAnswer:[] Ask the user to match each word to the correct video.
   - Randomize the order of both lists.
   - in 'description' include instruction on matching words to videoUrls

Quiz Structure
- The quiz should contain a randomized mix of the question types listed above.
- Order the questions in a way that changes with each quiz instance.

Do not include identical questions in the same quiz instance. Randomize the quiz questions and answer options to ensure each quiz is unique.
You can randomly choose from 60% to 80% of words to create questions.
in your response include JSON structure of the quiz as specified in the system prompt. each question should be unique and include xpValue that is shown in ${quizTemplates} depending on type of question .
The JSON format should be as follows, corresponding to specific chosen queston type:
${quizTemplates}
`;

class LLMService {
  async generateQuiz(courseId: string) {
    try {
      const vocabularyList = await CourseService.getVocabularyList(courseId);

      if (!vocabularyList || vocabularyList.length === 0) {
        throw new Error("No vocabulary found for this course");
      }

      const quizPrompt = this.constructQuizPrompt(vocabularyList);

      console.log("Attempting to generate quiz");

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: quizPrompt,
          },
        ],
        max_tokens: 1500,
      });
      if (
        !response ||
        !response.choices ||
        !response.choices[0].message ||
        !response.choices[0].message.content
      ) {
        throw new Error("Invalid response format from OpenAI");
      }

      const resJson: string = response.choices[0].message.content;

      return resJson;
    } catch (error: any) {
      console.error("Error evaluating image:", error.message);
      throw new Error("Failed to evaluate image using OpenAI");
    }
  }

  private constructQuizPrompt(
    vocabularyList: { word: string; videoUrl: string }[]
  ) {
    const formattedVocabulary = vocabularyList
      .map(({ word, videoUrl }) => `Word: "${word}", Video URL: "${videoUrl}"`)
      .join("\n");

    return `Generate a sign language quiz based on the following vocabulary words and video URLs :\n\n${formattedVocabulary}\n\n. 
        Create a mix of question types (Multiple Choice, True/False, Fill in the Blank, Matching) as previously defined.
        Make sure the quiz order is randomized.
        Create at least one multiple-choice question, true/false question, fill-in-the-blank question based on this vocabulary.
        - Randomize the order of questions and answers.
        - Ensure each quiz is unique and balanced across question types.

         Please respond with a JSON structure of the quiz as specified in the system prompt.`;
  }
}

export default LLMService;
