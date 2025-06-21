import { GoogleGenerativeAI } from "@google/generative-ai";
import { batch1Schema, batch2Schema, batch3Schema } from "../openai/schemas";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const promptSuffix = `generate travel data according to the schema and in json format, do not return anything in your response outside of curly braces, generate response as per the function schema provided. Dates given, activity preference and travelling with may influence like 50% while generating plan.`;

const callGeminiApi = async (prompt: string, schema: any, description: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  // You may need to parse result to match OpenAI's response structure
  return result;
};

type GeminiInputType = {
  userPrompt: string;
  activityPreferences?: string[] | undefined;
  fromDate?: number | undefined;
  toDate?: number | undefined;
  companion?: string | undefined;
};

export const generatebatch1 = (promptText: string) => {
  const prompt = `${promptText}, ${promptSuffix}`;
  const description = `Generate a description of information about a place or location according to the following schema:\n\n  - About the Place:\n    - A string containing information about the place, comprising at least 50 words.\n  \n  - Best Time to Visit:\n    - A string specifying the best time to visit the place.\n  \n  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.\n  `;
  return callGeminiApi(prompt, batch1Schema, description);
};

export const generatebatch2 = (inputParams: GeminiInputType) => {
  const description = `Generate a description of recommendations for an adventurous trip according to the following schema:\n  - Top Adventures Activities:\n    - An array listing top adventure activities to do, including at least 5 activities.\n    - Each activity should be specified along with its location.\n  \n  - Local Cuisine Recommendations:\n    - An array providing recommendations for local cuisine to try during the trip.\n  \n  - Packing Checklist:\n    - An array containing items that should be included in the packing checklist for the trip.\n  \n  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.`;
  return callGeminiApi(getPrompt(inputParams), batch2Schema, description);
};

export const generatebatch3 = (inputParams: GeminiInputType) => {
  const description = `Generate a description of a travel itinerary and top places to visit according to the following schema:\n  - Itinerary:\n    - An array containing details of the itinerary for the specified number of days.\n    - Each day's itinerary includes a title and activities for morning, afternoon, and evening.\n    - Activities are described as follows:\n      - Morning, Afternoon, Evening:\n        - Each includes an array of itinerary items, where each item has a description and a brief description.\n  \n  - Top Places to Visit:\n    - An array listing the top places to visit along with their coordinates.\n    - Each place includes a name and coordinates (latitude and longitude).\n  \n  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.`;
  return callGeminiApi(getPrompt(inputParams), batch3Schema, description);
};

const getPrompt = ({ userPrompt, activityPreferences, companion, fromDate, toDate }: GeminiInputType) => {
  let prompt = `${userPrompt}, from date-${fromDate} to date-${toDate}`;
  if (companion && companion.length > 0) prompt += `, travelling with-${companion}`;
  if (activityPreferences && activityPreferences.length > 0) prompt += `, activity preferences-${activityPreferences.join(",")}`;
  return prompt;
};
