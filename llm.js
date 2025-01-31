import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const API_KEY = process.env.GOOGLE_API_KEY;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0.7,
  maxRetries: 2,
  // other params...
});


export default llm;