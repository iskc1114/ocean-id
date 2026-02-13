import { GoogleGenerativeAI } from "@google/generative-ai";
import { marineBiologistPrompt } from "../../prompt";

export async function POST(req) {
try {
const { image } = await req.json();

// 1. Check API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
return new Response(JSON.stringify({ error: "API Key missing on Vercel" }), { status: 500 });
}

const genAI = new GoogleGenerativeAI(apiKey);

// 2. Use the most stable model name
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 3. Process image data
const base64Data = image.split(",")[1];

const result = await model.generateContent([
marineBiologistPrompt,
{
inlineData: {
data: base64Data,
mimeType: "image/jpeg"
}
}
]);

const response = await result.response;
const text = response.text();
// 4. Clean and Parse JSON
const cleanedText = text.replace(/```json|```/g, "").trim();
const data = JSON.parse(cleanedText);

return new Response(JSON.stringify(data), { status: 200 });
} catch (error) {
console.error("DEBUG:", error);
return new Response(JSON.stringify({ error: "AI Error: " + error.message }), { status: 500 });
}
}
