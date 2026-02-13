import { GoogleGenerativeAI } from "@google/generative-ai";
import { marineBiologistPrompt } from "../../prompt";

export async function POST(req) {
try {
const { image } = await req.json();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
return Response.json({ error: "Missing API Key" }, { status: 500 });
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const base64Data = image.split(",")[1];
const result = await model.generateContent([
marineBiologistPrompt,
{ inlineData: { data: base64Data, mimeType: "image/jpeg" } }
]);
const text = await result.response.text();
const cleaned = text.replace(/
json|
/g, "").trim();

return new Response(cleaned, {
status: 200,
headers: { 'Content-Type': 'application/json' }
});
} catch (error) {
return Response.json({ error: error.message }, { status: 500 });
}
}
