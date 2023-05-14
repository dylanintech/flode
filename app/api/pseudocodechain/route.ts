import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SimpleSequentialChain } from "langchain/chains";

export const runtime = 'edge';

export async function PUT(request: NextRequest) {
   const { input } = await request.json();

   const pseudocodeModel = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.2,
    // maxTokens: 50,
   })

   const pseudocodePromptTemplate = "You are a programming assistant. You help programmers uderstand how to build their applications by providing pseudocode. You will be given an item from a to-do list and must generate some valid pseudocode to implement that item. For example, if the item is 'write logic to handle user data' then reply with 'IF userlogin = true: API call to get user data, assign data to variables, re-route user to dashboard | ELSEIF userlogin failed more than 3 times: don't allow more attempts, send user notification email, re-route user to home page'. Respond to the following to-do list item with pseudocode as described above: {item}."

   const pseudocodePrompt = new PromptTemplate({
    template: pseudocodePromptTemplate,
    inputVariables: ["item"],
   });

   const pseudocodeChain = new LLMChain({ llm: pseudocodeModel, prompt: pseudocodePrompt });

   const res = await pseudocodeChain.call({ item: input });

   return NextResponse.json({ response: res});
}