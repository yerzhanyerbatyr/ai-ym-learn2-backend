export const systemPromptJsonExample = `
{

}
`;
export const quizTemplates = {
  multipleChoiceVideo: {
    type: "multipleChoiceVideo",
    description: "", // word
    words: [], // should be null
    videoUrls: [], // List of answer options.
    correctAnswer: "", // VideoUrl of correct answer
    xpValue: 10, // XP points for the question.
  },
  multipleChoiceText: {
    type: "multipleChoiceText",
    description: "", // VideoUrl
    words: [], // List of answer options.
    videoUrls: [], // should be null
    correctAnswer: "", // VideoUrl of correct answer
    xpValue: 10, // XP points for the question.
  },
  trueFalse: {
    type: "trueFalse",
    description: "",
    words: [], // should be null
    videoUrls: [], // only 1 video link for correct answer
    correctAnswer: "", // Boolean for the correct answer.
    xpValue: 5,
  },
  matching: {
    type: "matching",
    description: "", // Instructions for the matching task.
    words: [], // shuffled words
    videoUrls: [], // shuffled videos
    correctAnswer: [
      // Array of correct word/video matches.
      {
        word: "",
        videoUrl: "",
      },
      {
        word: "",
        videoUrl: "",
      },
      {
        word: "",
        videoUrl: "",
      },
      {
        word: "",
        videoUrl: "",
      },
    ],
    xpValue: 15,
  },
  fillInBlank: {
    type: "fillInBlank",
    description: "", // Sentence with a blank (e.g., "Hello, [____].")
    words: [], // should be null
    videoUrls: [], // only 1 video link
    correctAnswer: "", // Correct word to fill in the blank.
    xpValue: 10,
  },
};
