import { GoogleGenerativeAI } from "@google/generative-ai";
import { marineBiologistPrompt } from "../../prompt";
export async function POST(req) {
try {
const { image } = await req.json();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
return new Response(JSON.stringify({ error: "No API Key" }), { status: 500 });
}

const genAI = new GoogleGenerativeAI(apiKey);

// CHANGED TO GEMINI 2.0 FLASH (More stable)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const base64Data = image.split(",")[1];

const result = await model.generateContent([
marineBiologistPrompt,
{ inlineData: { data: base64Data, mimeType: "image/jpeg" } }
]);

const response = await result.response;
const text = response.text();

const start = text.indexOf("{");
const end = text.lastIndexOf("}") + 1;
const finalJson = text.substring(start, end);

return new Response(finalJson, {
status: 200,
headers: { "Content-Type": "application/json" }
});
} catch (error) {
return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}