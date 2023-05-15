'use client';

import React, { useEffect, useState } from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSupabase } from "./supabase-provider";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import { useRouter } from "next/navigation";

interface NewUserProps {
    fullName: string | null, 
    avatarURL: string | undefined,
    credits: number | null,
    session: Session | null,
}

export default function NewUser(props: NewUserProps) {
    const router = useRouter();
    const { supabase } = useSupabase();
    const [description, setDescription] = useState<string | null>(null);
    const [workStyle, setWorkStyle] = useState<string | null>(null);

    //function that updates the user's profile in the 'profiles' table
    const updateProfile = async() => {
        const { data, error } = await supabase
        .from('profiles')
        .update({
            description: description,
            work_style: workStyle,
        })
        .eq('id', props.session?.user.id)
        .select();

        if (error) {
            console.error('error updating profile', error);
        }

        if (data) {
            console.log('data', data);
           
        }
    }

    return (
        <div className='w-full flex flex-col gap-4 justify-center items-center'>
            <div className="flex flex-col w-full">
                <div className="flex flex-row items-center">
                    <h1 className="text-black font-mono text-5xl">what&apos;s up {props.fullName} 👋</h1>
                    {/* <img src={props.avatarURL} alt="avatar" className='w-20 h-20 rounded-full'/> */}
                </div>
                <p className="font-mono text-gray-500">welcome to flode. we&apos;re gonna ask you a couple questions so that your lists are rlly personalized.</p>
            </div>
            <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="font-mono text-black">describe yourself in one tweet</label>
                    <textarea
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description || ''}
                    name="description"
                    className="bg-white w-full ring ring-gray-500 rounded-xl font-mono text-black p-3 disabled:opacity-20"
                    placeholder="Yo what's up! I'm Dylan - a high schooler and software builder. I love building and creating products ppl want lol."
                     />
                </div>
                 <div className="flex flex-col gap-1">
                     <label htmlFor="work style" className="font-mono text-black">help us understand how you work best</label>
                     <textarea
                     value={workStyle || ''}
                     onChange={(e) => setWorkStyle(e.target.value)}
                     name="work style"
                     className="bg-white w-full ring ring-gray-500 rounded-xl font-mono text-black p-3 disabled:opacity-20"
                     placeholder="I'm super excited about everything related to tech and work best when I gain momentum earlier on in the day by completing the easierst tasks first."
                     />
                 </div>
            </div>
            <button 
            className="rounded-full p-2 bg-black w-1/4 shadow-2xl hover:bg-slate-800 disabled:opacity-20" 
            onClick={(e) => {
                e.preventDefault();
                updateProfile();
            }}>
                <p className="text-white font-mono">add info</p>
            </button>
        </div>
    )
}