'use client';

import React, { useEffect, useState } from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSupabase } from "./supabase-provider";
import { Session } from "@supabase/gotrue-js/src/lib/types"

interface AccountProps {
    fullName: string | null,
    avatarURL: string | undefined,
    credits: number | null,
    session: Session | null,
    description: string | null,
    workStyle: string | null,
}

export default function Account(props: AccountProps) {
    const [newDescription, setNewDescription] = useState<string | null>(props.description);
    const [newWorkStyle, setNewWorkStyle] = useState<string | null>(props.workStyle);

    const { supabase } = useSupabase();

    const updateProfile = async() => {
        const { data, error } = await supabase
        .from('profiles')
        .update({ description: newDescription, work_style: newWorkStyle })
        .eq('id', props.session?.user.id)
        .select();

        if (error) {
            alert("error updating data");
        }

        if (data) {
            alert("updated your profile!")
        }
    }

    //sign out function
    const signOut = async() => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("error signing out");
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full bg-slate-300 rounded-lg shadow-md p-1 justify-start">
            <div className="flex flex-col">
                <div className="flex flex-row gap-1 w-full items-center">
                  <h1 className="text-black font-mono">{props.fullName}</h1>
                  <img src={props.avatarURL} className="rounded-full w-8 h-8 text-center" alt="profile picture"></img>
                </div>
                <p className="text-black font-mono">credits available: {props.credits}</p>
                <p className="text-black font-mono">want some more? give some <a href='https://notionforms.io/forms/feedback-on-flode' target="none" className="text-black font-mono underline">feedback</a>!</p>
            </div>
            <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="font-mono text-black">describe yourself in one tweet</label>
                    <textarea
                    required
                    onChange={(e) => setNewDescription(e.target.value)}
                    value={newDescription || ''}
                    name="description"
                    className="bg-white w-full ring ring-gray-500 rounded-xl font-mono text-black p-3 disabled:opacity-20"
                    placeholder="Yo what's up! I'm Dylan - a high schooler and software builder. I love building and creating products ppl want lol."
                     />
                </div>
                 <div className="flex flex-col gap-1">
                     <label htmlFor="work style" className="font-mono text-black">help us understand how you work best</label>
                     <textarea
                     value={newWorkStyle || ''}
                     onChange={(e) => setNewWorkStyle(e.target.value)}
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
                <p className="text-white font-mono">save</p>
            </button>
            <button className="rounded-full p-2 bg-red-600 w-1/4 shadow-2xl hover:bg-red-700 disabled:opacity-20" onClick={(e) => {
                e.preventDefault();
                signOut();
            }}>
                <p>sign out</p>
            </button>
        </div>
    )
}