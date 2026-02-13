import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMarineBiologistPrompt } from "../../prompt";

export async function POST(req) {
try {
const { image, lang } = await req.json();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const result = await model.generateContent([
getMarineBiologistPrompt(lang),
{ inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } }
]);

const response = await result.response;
const text = response.text();
const start = text.indexOf("{");
const end = text.lastIndexOf("}") + 1;

return new Response(text.substring(start, end), { status: 200, headers: { 'Content-Type': 'application/json' } });
} catch (error) {
return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}
