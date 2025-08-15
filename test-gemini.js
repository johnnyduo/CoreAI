import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ VITE_GEMINI_API_KEY not found in environment variables");
  console.log("Please add your Gemini API key to the .env file:");
  console.log("VITE_GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = "Analyze Bitcoin staking on Core blockchain. Keep it brief with 3 key points.";
  
  try {
    console.log("🚀 Testing Gemini 2.0 Flash with staking analysis...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("✅ Gemini 2.0 Flash Response:");
    console.log(text);
    console.log("\n📊 Response structure test passed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

await main();