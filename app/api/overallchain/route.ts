import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SimpleSequentialChain } from "langchain/chains";

export const runtime = 'edge';

//change prompts to return responses in first person
export async function PUT(request: NextRequest) {
     //first layer
     const firstLayerModel = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.5,
    })

    const template = "You are an assistant that helps programmers build their applications by creating to-do lists to help them break down their apps into smaller chunks. You are a software expert and understand how to build apps. Create a to-do list with five steps to build this app: {app}. Make sure to respond with the item number at the beginning of each to-do list item. Make sure to sound personal and include the name of the programmer's app in your responses. Make sure to respond in the first person. Example: if the app is 'a desktop electron app built with ElectronJS' then the first item should be something like '1. Initialize the Electron to-do list app using electron forge and open my project in the code editor. Check the ElectronJS documentation for the correct command.'. Make sure that your response is specific to the app that the programmer is building. For example, only say Electron if it's relevant to the programmer's app";

    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["app"],
    })

    const firstLayerchain = new LLMChain({ llm: firstLayerModel, prompt: prompt });

    //second layer
    const secondLayerModel = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.5,
        // maxTokens: 100,
    })
    
    const secondTemplate = "You are a programming assistant. You have an expert conceptual understanding of building software. When you are given a to-do list item you respond with a more technical and detailed explanation of how to complete that item. For example, if the to-do list item is '1. Build the frontend using Next.js' you will respond with something like 'run create-next-app@latest in my terminal and open the project in my code editor'. Make sure to respond in the same format as the input and keep the numbers at the beginning of each item. Respond to the following to-do list item with a more detailed and technical description of how to complete it: {item}"
    
    const secondPrompt = new PromptTemplate({
        template: secondTemplate,
        inputVariables: ["item"],
    })

    const secondLayerChain = new LLMChain({ llm: secondLayerModel, prompt: secondPrompt });

    //overall chain
    const overallChain = new SimpleSequentialChain({
        chains: [firstLayerchain, secondLayerChain],
        verbose: true,
    })

    // const { input } = await request.json();
    const { input } = (await request.json());
    console.log('this is the input on the server', input);

    const res = await overallChain.run(input);

    //return server response
    return NextResponse.json({ response: res});
}