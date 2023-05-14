'use client';

import React, { useEffect, useState } from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSupabase } from "./supabase-provider";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import ListPage from "./ListPage";
import NewList from "./NewList";
import { UUID } from "crypto";
import Login from "./login";

interface List {
    id: UUID,
    name: string,
    user_id: UUID,
    created_at: any,
}

export default function Home() {
    //lists state that is either an array of lists or null
    const [lists, setLists] = useState<List[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const { supabase } = useSupabase();
    //list page state
    const [currentListID, setCurrentListID] = useState<UUID | null>(null);
    const [currentListName, setCurrentListName] = useState<string | null>(null);
    const [creatingNewList, setCreatingNewList] = useState(true);

    const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);
    const [fullName, setFullName] = useState<string | null>(null);
    const [credits, setCredits] = useState<number | null>(null);

        //useEffect hook that checks for session whenever supabase changes
        useEffect(() => {
            const getSession = async() => {
                const { data, error } =  await supabase.auth.getSession();
                console.log('data', data);
                if (data) {
                    setSession(data.session);
                } 
                if (error) {
                    console.error('error getting session', error);
                }
            }
            getSession();
        }, [supabase]);

        useEffect(() => {
            const getProfileData = async() => {
                console.log('user id', session?.user.id)
                const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user.id);
    
                if (data) {
                    setAvatarURL(data[0].avatar_url);
                    setFullName(data[0].full_name);
                    setCredits(data[0].credits);
                }
    
                if (error) {
                    console.error('error getting profile data', error);
                }
            }
            getProfileData();
        }, [session, supabase, loading, creatingNewList]);

    //useEffect to fetch lists from the 'lists' table in the database if the user_id property equals the current user's id
    useEffect(() => {
        const fetchLists = async() => {
            setLoading(true);
            const { data, error } = await supabase
                .from('lists')
                .select('*')
                .eq('user_id', session?.user.id)
            if (data) {
                setLists(data as List[]);
            }
            if (error) {
                console.error('error fetching lists', error);
            }
            setLoading(false);
        }
        // if (session) {
        //     fetchLists();
        // }
        fetchLists();

    }, [session, supabase]);

    //function to check if all todos in a list are completed


    return (
        <>
        {session && 
        <div className="flex flex-row w-full min-h-screen bg-white">
            <div className="flex flex-col w-1/6 min-h-screen bg-black justify-between p-1">
                <div className="flex flex-row items-center justify-start gap-2">
                    <img className="w-10 h-10" src="https://media.discordapp.net/attachments/993733319386730541/1107410868783808572/Screenshot_2023-05-14_at_3.55.12_PM.png?width=360&height=348"></img>
                    <h1 className="font-mono text-white font-bold">beta</h1>
                </div>
                {loading && 
                    <div className="flex flex-col w-full justify-start items-start">
                        <Skeleton count={10} height={30} baseColor="gray" />
                    </div>
                }
                {!lists && <p className="text-white font-mono items-center">no lists yet!</p>}
                <div className="flex flex-col h-full w-full justify-start items-start">
                {lists && lists.map((list) => {
                    return (
                        <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentListID(list.id);
                            setCurrentListName(list.name);
                            setCreatingNewList(false);
                        }}
                        className="flex flex-row items-center justify-center bg-black w-full p-2 hover:bg-gray-800 rounded-lg" 
                        key={list.id}>
                            <p className="text-white font-mono">{list.name}</p>
                        </button>
                    )
                })}
                </div>
                <div className="flex flex-col"> 
                    <button className="rounded-lg bg-black hover:bg-gray-800 flex flex-row items-center p-2 w-full" onClick={(e) => { 
                        e.preventDefault();
                        setCreatingNewList(true);
                    }}>
                        <p className="font-mono text-white text-center w-full font-bold">+ create new list</p>
                    </button>
                    <div className="flex flex-row gap-1 w-full items-center justify-center">
                        <p className="font-bold text-white text-center">builder:</p>
                        <img className="rounded-full w-8 h-8 text-center" src={avatarURL} alt="pfp"></img>
                    </div>
                    <p className="text-white text-center font-mono w-full">credits: {credits}</p>
                    <a href='https://notionforms.io/forms/feedback-on-flode' target='none' className='text-center underline text-white font-mono'>feedback</a>
                </div>
            </div>
            <div className="bg-white w-full p-2 flex items-center justify-center">
                {currentListID && currentListName && !creatingNewList && <ListPage session={session} idOfList={currentListID} nameOfList={currentListName} />}
                {creatingNewList && <NewList session={session} credits={credits} />}
            </div>
        </div>}
        {!session && <Login />}
        </>
    )
}