import Image from 'next/image'
import { OpenAI } from "langchain/llms/openai";
import Interact from './interact';
import { createClient } from '@supabase/supabase-js';
import { Session } from "@supabase/auth-helpers-nextjs"
import Home from './Home';


export const runtime = 'edge';

export default async function Page() { //changed from Home()
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-center ">
      {/* <div className='flex flex-row items-center justify-between my-1 w-full'>
        <div className='flex flex-row items-center gap-4'>
          <div className='flex flex-row items-center'>
            <img src='https://media.discordapp.net/attachments/993733319386730541/1107139431191818290/Screenshot_2023-05-13_at_9.56.41_PM.png?width=1368&height=1264' className='w-14 h-13'></img>
            <h1 className='font-mono text-2xl text-black'>demo</h1>
          </div>
          <div className='rounded-full bg-black'>
            <p className='font-mono text-white p-2'>the to-do list app for builders</p>
          </div>
        </div>
        <a href='https://notionforms.io/forms/feedback-on-flode' target='none' className='underline text-black font-mono'>feedback</a>
      </div> */}
      {/* <Interact /> */}
      <Home />
    </main>
  )
}
