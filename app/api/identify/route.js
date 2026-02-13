import { GoogleGenerativeAI } from "@google/generative-ai";
import { marineBiologistPrompt } from "../../prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
try {
const { image } = await req.json();
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent([
marineBiologistPrompt,
{
inlineData: {
data: image.split(",")[1],
mimeType: "image/jpeg"
}
}
]);

const response = await result.response;
const text = response.text();
const cleanedText = text.replace(/```json|```/g, "").trim();
const data = JSON.parse(cleanedText);

return new Response(JSON.stringify(data), { status: 200 });
} catch (error) {
console.error("Identification Error:", error);
return new Response(JSON.stringify({ error: "Failed to identify creature" }), { status: 500 });
}
}
