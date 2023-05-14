import { SerpAPI } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";

export const runtime = 'edge';

export async function PUT(request: Request) {
    const { input } = await request.json();

    const tools = [
        new SerpAPI(process.env.SERPAPI_API_KEY, {
          location: "Austin,Texas,United States",
          hl: "en",
          gl: "us",
        }),
    ];

    const agentModel = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.2,
    })

    const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
        agentType: "zero-shot-react-description",
        verbose: true,
        maxIterations: 5,
    });

    const prompt = `You are an agent that helps programmers build applications by providing them with a detailed technical explanation of how to complete items on their to-do lists. For example, if the to-do list item is 'Build the frontend using Next.js' you will respond with something like 'run create-next-app@latest in your terminal and open the project in your code editor'. Figure out how to implement the following item on the programmer's to-do list: ${input}.`;

    const res = await executor.run({ input: prompt });

    return NextResponse.json({ response: res});
}