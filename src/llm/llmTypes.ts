export const systemPromptJsonExample = `
{

}
`
export const quizTemplates = {
    multipleChoiceVideo: {
      type: "multipleChoiceVideo",
      description: "",  // word
      options: [],      // List of answer options.
      correctAnswer: {
        word: "",
        videoUrl: "",
      },
      xpValue: 10,      // XP points for the question.
    },
    multipleChoiceText: {
        type: "multipleChoiceText",
        description: "",  // VideoUrl
        options: [],      // List of answer options.
        correctAnswer: "", // VideoUrl of correct answer
        xpValue: 10,      // XP points for the question.
      },
    trueFalse: {
      type: "trueFalse",
      description: "", 
      videoUrl:"",
      correctAnswer: true, // Boolean for the correct answer.
      xpValue: 5,
    },
    // matching: {
    //   type: "matching",
    //   words:[],
    //   videoUrls:[],
    //   description: "",  // Instructions for the matching task.
    //   pairs: [  // Array of correct word/video matches.
    //     {
    //         word: "",
    //         videoUrl: "",
    //     },
    //     {
    //         word: "",
    //         videoUrl: "",
    //     },
    //     {
    //         word: "",
    //         videoUrl: "",
    //     },
    //     {
    //         word: "",
    //         videoUrl: "",
    //     },
    //   ],      
    //   xpValue: 15,
    // },
    fillInBlank: {
      type: "fillInBlank",
      videoUrl: "",
      description: "",  // Sentence with a blank (e.g., "Hello, [____].")
      correctAnswer: {
        word: "",
        videoUrl: "",
      }, // Correct word to fill in the blank.
      xpValue: 10,
    }
  };
  