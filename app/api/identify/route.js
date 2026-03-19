import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMarineBiologistPrompt } from "../../prompt";
import speciesData from '../../../data/species.json';

export async function POST(req) {
try {
const { image, lang } = await req.json();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const result = await model.generateContent([
getMarineBiologistPrompt(lang),
{ inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } }
]);

const response = await result.response;
const text = response.text();
const start = text.indexOf("{");
const end = text.lastIndexOf("}") + 1;
const aiResult = JSON.parse(text.substring(start, end));

// Search for enriched metadata in our local database
const match = speciesData.find(s => 
  s.scientificName.toLowerCase().includes(aiResult.scientificName.toLowerCase()) || 
  aiResult.scientificName.toLowerCase().includes(s.scientificName.toLowerCase())
);

if (match) {
  if (match.size) aiResult.depthRange = `${match.size} | ${aiResult.depthRange}`;
  if (match.depth) aiResult.habitat = `Depth: ${match.depth} | ${aiResult.habitat}`;
}

return new Response(JSON.stringify(aiResult), { status: 200, headers: { 'Content-Type': 'application/json' } });
} catch (error) {
return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}
