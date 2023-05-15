'use client';

import React, { useEffect, useState } from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSupabase } from "./supabase-provider";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import Login from "./login";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';

interface NewListProps {
    credits: number | null,
    session: Session | null,
}

export default function NewList(props: NewListProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string | undefined>(undefined);
    const [listTitle, setListTitle] = useState('');
    const [item1, setItem1] = useState<string | undefined>(undefined);
    const [item2, setItem2] = useState<string | undefined>(undefined);
    const [item3, setItem3] = useState<string | undefined>(undefined);
    const [item4, setItem4] = useState<string | undefined>(undefined);
    const [item5, setItem5] = useState<string | undefined>(undefined); //used to just be ('')
    const [pseudocode1, setPseudocode1] = useState('');
    const [pseudocode2, setPseudocode2] = useState('');
    const [pseudocode3, setPseudocode3] = useState('');
    const [pseudocode4, setPseudocode4] = useState('');
    const [pseudocode5, setPseudocode5] = useState('');
    const [pseudocode1Loading, setPseudocode1Loading] = useState(false);
    const [pseudocode2Loading, setPseudocode2Loading] = useState(false);
    const [pseudocode3Loading, setPseudocode3Loading] = useState(false);
    const [pseudocode4Loading, setPseudocode4Loading] = useState(false);
    const [pseudocode5Loading, setPseudocode5Loading] = useState(false);
    const [editingItem1, setEditingItem1] = useState(false);
    const [editingItem2, setEditingItem2] = useState(false);
    const [editingItem3, setEditingItem3] = useState(false);
    const [editingItem4, setEditingItem4] = useState(false);
    const [editingItem5, setEditingItem5] = useState(false);
    const [editedItem1, setEditedItem1] = useState('');
    const [editedItem2, setEditedItem2] = useState('');
    const [editedItem3, setEditedItem3] = useState('');
    const [editedItem4, setEditedItem4] = useState('');
    const [editedItem5, setEditedItem5] = useState('');
    //generatedID that is either a uuid or null
    const [generatedID, setGeneratedID] = useState<string | null>(null);
    //experimental
    const [agentItem1, setAgentItem1] = useState('');
    const [agentItem2, setAgentItem2] = useState('');
    const [agentItem3, setAgentItem3] = useState('');
    const [agentItem4, setAgentItem4] = useState('');
    const [agentItem5, setAgentItem5] = useState('');
    //add loading and include react skeleton to simulate the items
    const [loading, setLoading] = useState(false);

    //db
    const { supabase } = useSupabase();
    // const [session, setSession] = useState<Session | null>(null);

    //user data
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    

    function parseToDoList(textResponse: string): string[] {
        // Split the text response into individual items based on the numbering pattern
        const items = textResponse.split(/\d+\. /).slice(1);
      
        // Return the array of parsed items
        // return items.map((item, index) => `${index + 1}. ${item.trim()}`);;
        return items.map(item => item.trim());
    }

    const createList = async () => {
        try {
            if (props.credits) {
                setLoading(true);
                console.log('input', input);

                // prod: 'https://flode.vercel.app/api/overallchain'

                const res = await fetch('https://flode.vercel.app/api/overallchain', {
                    method: "put",
                    body: JSON.stringify({ input: input }),
                })
    
                console.log('res', res);
    
                const { response } = await res.json();
    
                //receive response from server and pass to parseToDoList
                console.log('response', response);
                const items = parseToDoList(response);
                
                console.log('items', items);

                setItem1(items[0]);
                setItem2(items[1]);
                setItem3(items[2]);
                setItem4(items[3]);
                setItem5(items[4]);

                const newUUID = uuidv4();
                setGeneratedID(newUUID);
                

                //insert each item into the todos table
                const { error } = await supabase
                .from('todos')
                .insert([
                    { task: items[0], user_id: props.session?.user.id, is_complete: false, list_name: listTitle, list_id: newUUID },
                    { task: items[1], user_id: props.session?.user.id, is_complete: false, list_name: listTitle, list_id: newUUID },
                    { task: items[2], user_id: props.session?.user.id, is_complete: false, list_name: listTitle, list_id: newUUID },  
                    { task: items[3], user_id: props.session?.user.id, is_complete: false, list_name: listTitle, list_id: newUUID },
                    { task: items[4], user_id: props.session?.user.id, is_complete: false, list_name: listTitle, list_id: newUUID },
                ])

                if (error) {
                    console.error('error inserting items into todos table', error);
                }

                const { error: error3 } = await supabase.from('lists').insert([
                    { name: listTitle, user_id: props.session?.user.id, id: newUUID }
                ])

                if (error3) {
                    console.error('error inserting list into lists table', error3);
                }

                //subtract 1 from user credits on profiles table
                const { data: data2, error: error2 } = await supabase
                .from('profiles')
                .update({ credits: props.credits - 1 })
                .eq('id', props.session?.user.id);

                if (data2) {
                    console.log('successfully subtracted credits from user');
                }

                if (error2) {
                    console.error('error subtracting credits from user', error2);
                }
    
                //set all pseudocodes to ''
                setPseudocode1('');
                setPseudocode2('');
                setPseudocode3('');
                setPseudocode4('');
                setPseudocode5('');
                
                setLoading(false);
            } else {
                alert("You've already spent all your credits for the demo! Dw tho - when v1 drops you'll get some more :)")
            }
        } catch (error) {
            console.error("Error when creating list: ", error);
        }
    }

    const generatePseudocode = async (passedItem: string) => {
        try {
            if (passedItem === item1) setPseudocode1Loading(true);
            if (passedItem === item2) setPseudocode2Loading(true);
            if (passedItem === item3) setPseudocode3Loading(true);
            if (passedItem === item4) setPseudocode4Loading(true);
            if (passedItem === item5) setPseudocode5Loading(true);
            
            // const res = await pseudocodeChain.call({ item: passedItem });
            // prod: 'https://flode.vercel.app/api/pseudocodechain'
            const res = await fetch('https://flode.vercel.app/api/pseudocodechain', {
                method: "put",
                body: JSON.stringify({ input: passedItem }),
            })

            console.log('res', res);

            const { response } = await res.json();

            console.log('res', res);

            if (passedItem === item1) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('list_id', generatedID)
                .eq('task', item1)
                .select();

                if (data) {
                    setPseudocode1Loading(false);
                    setPseudocode1(response.text)
                    console.log('successfully updated pseudocode for item 1');
                }

                if (error) {
                    console.error('error updating pseudocode for item 1', error);
                }
            };
            if (passedItem === item2) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('list_id', generatedID)
                .eq('task', item2)
                .select();

                if (data) {
                    setPseudocode2Loading(false);
                    setPseudocode2(response.text)
                    console.log('successfully updated pseudocode for item 2');
                }

                if (error) {
                    console.error('error updating pseudocode for item 2', error);
                }
            }
            if (passedItem === item3) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('list_id', generatedID)
                .eq('task', item3)
                .select();

                if (data) {
                    setPseudocode3Loading(false);
                    setPseudocode3(response.text)
                    console.log('successfully updated pseudocode for item 3');
                }

                if (error) {
                    console.error('error updating pseudocode for item 3', error);
                }
            } 
            if (passedItem === item4) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('list_id', generatedID)
                .eq('task', item4)
                .select();

                if (data) {
                    setPseudocode4Loading(false);
                    setPseudocode4(response.text)
                    console.log('successfully updated pseudocode for item 4');
                }

                if (error) {
                    console.error('error updating pseudocode for item 4', error);
                }
            }
            if (passedItem === item5) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('list_id', generatedID)
                .eq('task', item5)
                .select();

                if (data) {
                    setPseudocode5Loading(false);
                    setPseudocode5(response.text)
                    console.log('successfully updated pseudocode for item 5');
                }

                if (error) {
                    console.error('error updating pseudocode for item 5', error);
                }
            }

        } catch (error) {
            console.error("Error when generating pseudocode: ", error);
        }
    }

    const editItem = async () => {
        try {
            if (editedItem1) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem1 })
                .eq('id', generatedID)
                .select();

                if (data) {
                    setItem1(editedItem1);
                    setEditedItem1('');
                    setEditingItem1(false);
                }

                if (error) {
                    console.error('error updating item', error);
                    alert('error updating item');
                }
            }
            if (editedItem2) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem2 })
                .eq('task', item2).select();

                if (data) {
                    setItem2(editedItem2);
                    setEditedItem2('');
                    setEditingItem2(false);
                }

                if (error) {
                    console.error('error updating item', error);
                }
            }
            if (editedItem3) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem3 })
                .eq('task', item3).select();

                if (data) {
                    setItem3(editedItem3);
                    setEditedItem3('');
                    setEditingItem3(false);
                }

                if (error) {
                    console.error('error updating item', error);
                }
            }
            if (editedItem4) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem4 })
                .eq('task', item4).select();

                if (data) {
                    setItem4(editedItem4);
                    setEditedItem4('');
                    setEditingItem4(false);
                }

                if (error) {
                    console.error('error updating item', error);
                }
            }
            if (editedItem5) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem5 })
                .eq('task', item5).select();

                if (data) {
                    setItem5(editedItem5);
                    setEditedItem5('');
                    setEditingItem5(false);
                }

                if (error) {
                    console.error('error updating item', error);
                }
            }
        } catch (error) {
            console.error('error editing item', error);
        }
    }

    return (
        <div className='w-full flex flex-col gap-2 justify-center items-center'>
            {/* <div className="flex flex-col gap-2 w-1/2 rounded-lg shadow-xl bg-white p-2">
                <div className="flex flex-row gap-1 items-center justify-center rounded-lg">
                     {fullName ? <p className="text-2xl font-mono text-black">builder: {fullName}</p> : <p className="text-2xl font-mono text-black">no name</p>}
                     {avatarURL ? <img src={avatarURL} alt="avatar" className="rounded-full w-10"/> : <div className="rounded-full w-10 bg-gray"></div>}
                </div>
                {credits ? <p className="text-xl text-center font-mono text-black w-full">{credits} credits</p> : <p className="text-xl text-center text-black font-mono">0 credits</p>}
            </div> */}
            <label htmlFor="app" className="text-left font-mono w-full text-black">what do you want to build?</label>
            <input 
            id="app"
            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono text-black p-3 disabled:opacity-20" 
            placeholder="a to-do list app"
            disabled={loading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />
                <label htmlFor="name" className="text-left font-mono w-full text-black">give your new list a name</label>
            <input 
            id="name"
            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono text-black p-3 disabled:opacity-20" 
            placeholder="a to-do list app"
            disabled={loading}
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            />
            <button className="rounded-full p-2 bg-black w-1/4 shadow-2xl hover:bg-slate-800 disabled:opacity-20" disabled={loading || !input} onClick={(e) => {
                e.preventDefault();
                createList();
            }}>
                <p className="text-white font-mono">create to-do list</p>
            </button>
            {!loading && item1 && (
                <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg w-full my-2 p-2 items-center border-none">
                    <div className="flex flex-row gap-1 items-center">
                       {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> */}
                       <input type="checkbox" className="h-5 w-5 rounded-full" />
                       <p className="font-mono text-center text-black p-2">{item1}</p>
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingItem1(true);
                          }}
                          className="rounded-md p-1 border-none bg-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                       </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <button onClick={(e) => {
                            e.preventDefault();
                            generatePseudocode(item1);
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">generate pseudocode</p>
                        </button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            alert('vs code extension coming soon :)')
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">add item to vs code</p>
                        </button>
                    </div>
                    {editingItem1 && (
                        <div className="flex flex-col gap-1 items-center">
                            <label className="text-black">what do you wanna change this item to?</label>
                            <input
                            value={editedItem1}
                            onChange={(e) => setEditedItem1(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono p-2 text-black"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full justify-center">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem();
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem1(false);
                                 }} className="bg-black rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}
                    {pseudocode1 && (
                        <div className="flex flex-col gap-2 bg-black rounded-lg shadow-lg w-full my-2 p-2 items-start">
                            <p className="font-mono text-center text-white p-2">{pseudocode1}</p>
                        </div>
                    )}
                    {pseudocode1Loading && (
                         <div className="w-full">
                             <Skeleton height={40} baseColor="gray" />
                         </div>
                    )}
                </div>
            )}
             {!loading && item2 && (
                <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg w-full my-2 p-2 items-center border-none ">
                    <div className="flex flex-row gap-1 items-center">
                       {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> */}
                       <input type="checkbox" className="h-5 w-5 rounded-full" />
                       <p className="font-mono text-center text-black p-2">{item2}</p>
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingItem2(true);
                          }}
                          className="rounded-md p-1 border-none bg-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                       </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <button onClick={(e) => {
                            e.preventDefault();
                            generatePseudocode(item2);
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">generate pseudocode</p>
                        </button>
                        {/* when pseudocode is generated add conditional rendering for button to generate prompt/code for the item */}
                        <button onClick={(e) => {
                            e.preventDefault();
                            alert('vs code extension coming soon :)')
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">add item to vs code</p>
                        </button>
                    </div>
                    {editingItem2 && (
                        <div className="flex flex-col gap-1 items-center ">
                            <label className="text-black font-mono">what do you wanna change this item to?</label>
                            <input
                            value={editedItem2}
                            onChange={(e) => setEditedItem2(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem();
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem2(false);
                                 }} className="bg-red rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}
                    {pseudocode2 && (
                        <div className="flex flex-col gap-2 bg-black rounded-lg shadow-lg w-full my-2 p-2 items-start">
                            <p className="font-mono text-center text-white p-2">{pseudocode2}</p>
                        </div>
                    )}
                    {pseudocode2Loading && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                </div>
            )}
             {!loading && item3 && (
                <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg w-full my-2 p-2 items-center border-none ">
                    <div className="flex flex-row gap-1 items-center">
                       {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> */}
                       <input type="checkbox" className="h-5 w-5 rounded-full" />
                       <p className="font-mono text-center text-black p-2">{item3}</p>
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingItem3(true);
                          }}
                          className="rounded-md p-1 border-none bg-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                       </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <button onClick={(e) => {
                            e.preventDefault();
                            generatePseudocode(item3);
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">generate pseudocode</p>
                        </button>
                        {/* when pseudocode is generated add conditional rendering for button to generate prompt/code for the item */}
                        <button onClick={(e) => {
                            e.preventDefault();
                            alert("vs code extension coming soon :)")
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">add item to vs code</p>
                        </button>
                    </div>
                    {editingItem3 && (
                        <div className="flex flex-col gap-1 items-center ">
                            <label className="text-black font-mono">what do you wanna change this item to?</label>
                            <input
                            value={editedItem3}
                            onChange={(e) => setEditedItem3(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem();
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem3(false);
                                 }} className="bg-red rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}
                    {pseudocode3 && (
                        <div className="flex flex-col gap-2 bg-black rounded-lg shadow-lg w-full my-2 p-2 items-start">
                            <p className="font-mono text-center text-white p-2">{pseudocode3}</p>
                        </div>
                    )}
                    {pseudocode3Loading && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                </div>
            )}
             {!loading && item4 && (
                <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg w-full my-2 p-2 items-center border-none ">
                    <div className="flex flex-row gap-1 items-center">
                       {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> */}
                       <input type="checkbox" className="h-5 w-5 rounded-full" />
                       <p className="font-mono text-center text-black p-2">{item4}</p>
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingItem4(true);
                          }}
                          className="rounded-md p-1 border-none bg-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                       </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <button onClick={(e) => {
                            e.preventDefault();
                            generatePseudocode(item4);
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">generate pseudocode</p>
                        </button>
                        {/* when pseudocode is generated add conditional rendering for button to generate prompt/code for the item */}
                        <button onClick={(e) => {
                            e.preventDefault();
                            alert("vs code extension coming soon :)")
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">add to vs code</p>
                        </button>
                    </div>
                    {editingItem4 && (
                        <div className="flex flex-col gap-1 items-center ">
                            <label className="text-black font-mono">what do you wanna change this item to?</label>
                            <input
                            value={editedItem4}
                            onChange={(e) => setEditedItem4(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                e.preventDefault();
                                editItem();
                             }}>
                                <p className="text-black text-center font-mono">save</p>
                             </button>
                                <button onClick={(e) => {
                                e.preventDefault();
                                setEditingItem4(false);
                             }} className="bg-red rounded-xl p-2">
                                <p className="text-white font-mono text-center">cancel</p>
                             </button>
                        </div>
                    )}
                    {pseudocode4 && (
                        <div className="flex flex-col gap-2 bg-black rounded-lg shadow-lg w-full my-2 p-2 items-start">
                            <p className="font-mono text-center text-white p-2">{pseudocode4}</p>
                        </div>
                    )}
                    {pseudocode4Loading && (
                            <div className="w-full">
                                <Skeleton count={1} height={40} baseColor="gray" />
                            </div>
                    )}
                </div>
            )}
             {!loading && item5 && (
                <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg w-full my-2 p-2 items-center border-none ">
                    <div className="flex flex-row gap-1 items-center">
                        {/* change this svg to input with type set to chekbox */}
                       {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> */}
                       <input type="checkbox" className="h-5 w-5 rounded-full" />
                       <p className="font-mono text-center text-black p-2">{item5}</p>
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingItem5(true);
                          }}
                          className="rounded-md p-1 border-none bg-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                       </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <button onClick={(e) => {
                            e.preventDefault();
                            generatePseudocode(item5);
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">generate pseudocode</p>
                        </button>
                        {/* when pseudocode is generated add conditional rendering for button to generate prompt/code for the item */}
                        <button onClick={(e) => {
                            e.preventDefault();
                            alert("vs code extension coming soon :)")
                        }} className="bg-black rounded-full p-2">
                            <p className="text-white font-mono">add to vs code</p>
                        </button>
                    </div>
                    {editingItem5 && (
                        <div className="flex flex-col gap-1 items-center ">
                            <label className="text-black font-mono">what do you wanna change this item to?</label>
                            <input
                            value={editedItem5}
                            onChange={(e) => setEditedItem5(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                e.preventDefault();
                                editItem();
                             }}>
                                <p className="text-white text-center font-mono">save</p>
                             </button>
                                <button onClick={(e) => {
                                e.preventDefault();
                                setEditingItem5(false);
                             }} className="bg-red rounded-xl p-2">
                                <p className="text-white font-mono text-center">cancel</p>
                             </button>
                        </div>
                    )}
                    {pseudocode5 && (
                        <div className="flex flex-col gap-2 bg-black rounded-lg shadow-lg w-full my-2 p-2 items-start">
                            <p className="font-mono text-center text-white p-2">{pseudocode5}</p>
                        </div>
                    )}
                    {pseudocode5Loading && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                </div>
            )}
            {/* skeletons if items are not defined */}
            {loading && (
                <div className="flex flex-col  w-full">
                    <Skeleton count={5} height={90} baseColor="gray" />
                </div>
            )}         
        </div>
    )
}