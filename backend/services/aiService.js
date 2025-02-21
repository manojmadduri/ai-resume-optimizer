const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

exports.processResume = async (resumeData, jobDescription) => {
  const prompt = `Modify this resume based on the given job description. Maintain the same structure and format:\n\nResume:\n${JSON.stringify(resumeData)}\n\nJob Description:\n${jobDescription}`;
  
  const response = await openai.createCompletion({
    model: "gpt-4-turbo",
    prompt,
    max_tokens: 1000,
  });

  return JSON.parse(response.data.choices[0].text);
};
