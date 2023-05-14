// import { NextResponse } from "next/server";
// import { OpenAI } from "langchain/llms/openai";
// import { PromptTemplate } from "langchain/prompts";
// import { LLMChain, SimpleSequentialChain } from "langchain/chains";
// import { SerpAPI } from "langchain/tools";
// import { initializeAgentExecutorWithOptions } from "langchain/agents";

// //routes to handle all chain/agent calls

// //overall chain
// export async function RUNOVERALLCHAIN(request: Request) {
//     //first layer
//     const firstLayerModel = new OpenAI({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//         temperature: 0.2,
//     })

//     const template = "You are an assistant that helps programmers build their applications by creating to-do lists to help them break down their apps into smaller chunks. You are a software expert and understand how to build apps. Create a to-do list with five steps to build this app: {app}. Make sure to respond with the item number at the beginning of each to-do list item. Make sure to sound personal and include the name of the programmer's app in your responses. For example, if the app is 'a desktop electron app built with ElectronJS' the first item should be '1. Initialize the Electron to-do list app using electron forge and open your project in your code editor. Check the ElectronJS documentation for the correct command.";

//     const prompt = new PromptTemplate({
//         template: template,
//         inputVariables: ["app"],
//     })

//     const firstLayerchain = new LLMChain({ llm: firstLayerModel, prompt: prompt });

//     //second layer
//     const secondLayerModel = new OpenAI({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//         temperature: 0.2,
//         // maxTokens: 100,
//     })
    
//     const secondTemplate = "You are a programming assistant. You have an expert conceptual understanding of building software. When you are given a to-do list item you respond with a more technical and detailed explanation of how to complete that item. For example, if the to-do list item is '1. Build the frontend using Next.js' you will respond with something like 'run create-next-app@latest in your terminal and open the project in your code editor'. Make sure to respond in the same format as the input and keep the numbers at the beginning of each item. Respond to the following to-do list item with a more detailed and technical description of how to complete it: {item}"
    
//     const secondPrompt = new PromptTemplate({
//         template: secondTemplate,
//         inputVariables: ["item"],
//     })

//     const secondLayerChain = new LLMChain({ llm: secondLayerModel, prompt: secondPrompt });

//     //overall chain
//     const overallChain = new SimpleSequentialChain({
//         chains: [firstLayerchain, secondLayerChain],
//         verbose: true,
//     })

//     const { app } = await request.json();

//     const res = await overallChain.run({ app: app });

//     //return server response
//     return new Response(JSON.stringify(res), {
//         headers: { "content-type": "application/json" },
//     });
// }

// //pseudocode chain
// export async function RUNPSEUDOCODECHAIN(input: string) {
//     const pseudocodeModel = new OpenAI({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//         temperature: 0.2,
//         // maxTokens: 50,
//     })

//     const pseudocodePromptTemplate = "You are a programming assistant. You help programmers uderstand how to build their applications by providing pseudocode. You will be given an item from a to-do list and must generate some valid pseudocode to implement that item. For example, if the item is 'write logic to handle user data' then reply with 'IF userlogin = true: API call to get user data, assign data to variables, re-route user to dashboard | ELSEIF userlogin failed more than 3 times: don't allow more attempts, send user notification email, re-route user to home page'. Respond to the following to-do list item with pseudocode as described above: {item}."

//     const pseudocodePrompt = new PromptTemplate({
//         template: pseudocodePromptTemplate,
//         inputVariables: ["item"],
//     });

//     const pseudocodeChain = new LLMChain({ llm: pseudocodeModel, prompt: pseudocodePrompt });

//     const res = await pseudocodeChain.call({ item: input });

//     return res;
// }

// //agent 
// export async function RUNAGENT(input: string) {
//     const tools = [
//         new SerpAPI(process.env.SERPAPI_API_KEY, {
//           location: "Austin,Texas,United States",
//           hl: "en",
//           gl: "us",
//         }),
//     ];

//     const agentModel = new OpenAI({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//         temperature: 0.2,
//         maxTokens: 100,
//     })

//     const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
//          agentType: "zero-shot-react-description",
//         verbose: true,
//     });

//     const prompt = `You are an agent that helps programmers build applications by providing them with a detailed technical explanation of how to complete items on their to-do lists. For example, if the to-do list item is 'Build the frontend using Next.js' you will respond with something like 'run create-next-app@latest in your terminal and open the project in your code editor'. Figure out how to implement the following item on the programmer's to-do list: ${input}.`;

//     const res = await executor.run({ input: prompt });

//     return res;

// }