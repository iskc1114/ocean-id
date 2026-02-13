import { GoogleGenerativeAI } from "@google/generative-ai";
import { marineBiologistPrompt } from "../../prompt";

export async function POST(req) {
try {
const { image } = await req.json();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
return new Response(JSON.stringify({ error: "GEMINI_API_KEY is missing in Vercel settings." }), { status: 500 });
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

// Improved JSON cleaning
const cleanedText = text.replace(/
json|
/g, "").trim();

return new Response(cleanedText, {
status: 200,
headers: { 'Content-Type': 'application/json' }
});
} catch (error) {
console.error("AI Bridge Error:", error);
return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}
