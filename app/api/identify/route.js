import { GoogleGenerativeAI } from "@google/generative-ai";
import { marineBiologistPrompt } from "../../prompt";

export async function POST(req) {
try {
const { image } = await req.json();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const base64Data = image.split(",")[1];

const result = await model.generateContent([
marineBiologistPrompt,
{ inlineData: { data: base64Data, mimeType: "image/jpeg" } }
]);

const response = await result.response;
const rawText = response.text();

// Simpler cleanup that won't break the build
const cleanedText = rawText.split("
json").pop().split("
")[0].trim();

return new Response(cleanedText, {

status: 200,
headers: { "Content-Type": "application/json" }
});
} catch (error) {
return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}
