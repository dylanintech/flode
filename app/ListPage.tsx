'use client';

import React, { useEffect, useState } from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSupabase } from "./supabase-provider";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import Login from "./login";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';


interface ListPageProps {
    nameOfList?: string | null;
    idOfList?: UUID | null;
    session: Session | null;
}

export default function ListPage(props: ListPageProps) {
    const { supabase } = useSupabase();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<any>([]);
    const [newItem, setNewItem] = useState('');
    //creating list
    const [input, setInput] = useState('');
    const [listTitleCreating, setListTitleCreating] = useState('');
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');
    const [item3, setItem3] = useState('');
    const [item4, setItem4] = useState('');
    const [item5, setItem5] = useState('');
    const [listTitle, setListTitle] = useState('');
    //editing list items
    const [editingItem1, setEditingItem1] = useState(false);
    const [editingItem2, setEditingItem2] = useState(false);
    const [editingItem3, setEditingItem3] = useState(false);
    const [editingItem4, setEditingItem4] = useState(false);
    const [editingItem5, setEditingItem5] = useState(false);
    const [editingListTitle, setEditingListTitle] = useState(false);
    const [editedItem1, setEditedItem1] = useState('');
    const [editedItem2, setEditedItem2] = useState('');
    const [editedItem3, setEditedItem3] = useState('');
    const [editedItem4, setEditedItem4] = useState('');
    const [editedItem5, setEditedItem5] = useState('');
    //pseudocode
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
    const [toggledCheckbox, setToggledCheckbox] = useState(false);
    //user profile
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    


    useEffect(() => {
        const getSession = async() => {
            const { data, error } =  await supabase.auth.getSession();
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
            const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', props.session?.user.id);

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
    }, [props.session, supabase, loading]);



    //useEffect hook that fetches the list data from the todos table
    useEffect(() => {
        if (props.idOfList) {
            const getList = async() => {
                const { data, error } = await supabase
                .from('todos')
                .select('*')
                .eq('list_id', props.idOfList);

                if (data) {
                    setList(data);
                    setLoading(false);
                }

                if (error) {
                    console.error('error getting list', error);
                }
            }
            getList();
        }
    }, [props, supabase, loading, pseudocode1Loading, pseudocode2Loading, pseudocode3Loading, pseudocode4Loading, pseudocode5Loading, editingItem1, editingItem2, editingItem3, editingItem4, editingItem5, toggledCheckbox]);

    //function that adds a new item to the list
    const addItem = async() => {
        if (newItem) {
            const { data, error } = await supabase
            .from('todos')
            .insert([
                { 
                    item: newItem,
                    is_complete: false,
                    list_id: props.idOfList,
                    list_name: props.nameOfList
                }
            ]);

            if (data) {
                setNewItem('');
                setLoading(true);
            }

            if (error) {
                console.error('error adding item', error);
            }
        }
    }

    //function that deletes an item from the list
    const deleteItem = async(id: UUID) => {
        const { data, error } = await supabase
        .from('todos')
        .delete()
        .match({ id })
        .select();

        if (data) {
            console.log('item deleted');
        }

        if (error) {
            console.error('error deleting item', error);
        }
    }

    const editItem = async (index: number, id: number) => {
        try {
            if (editedItem1 && index === 0) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem1 })
                .eq('id', id)
                .select();

                if (data) {
                    setEditedItem1('');
                    setEditingItem1(false);
                }

                if (error) {
                    console.error('error updating item', error);
                    alert('error updating item');
                }
            }
            if (editedItem2 && index === 1) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem2 })
                .eq('id', id)
                .select();

                if (data) {
                    setEditedItem2('');
                    setEditingItem2(false);
                }

                if (error) {
                    console.error('error updating item', error);
                    alert('error updating item');
                }

            }
            if (editedItem3 && index === 2) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem3 })
                .eq('id', id)
                .select();

                if (data) {
                    setEditedItem3('');
                    setEditingItem3(false);
                }

                if (error) {
                    console.error('error updating item', error);
                    alert('error updating item');
                }
            }
            if (editedItem4 && index === 3) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem4 })
                .eq('id', id)
                .select();

                if (data) {
                    setEditedItem4('');
                    setEditingItem4(false);
                }

                if (error) {
                    console.error('error updating item', error);
                    alert('error updating item');
                }
            }
            if (editedItem5 && index === 4) {
                const { data, error } = await supabase
                .from('todos')
                .update({ task: editedItem5 })
                .eq('id', id)
                .select();

                if (data) {
                    setEditedItem5('');
                    setEditingItem5(false);
                }

                if (error) {
                    console.error('error updating item', error);
                    alert('error updating item');
                }
            }
        } catch (error) {
            console.error('error editing item', error);
        }
    }

    function parseToDoList(textResponse: string): string[] {
        // Split the text response into individual items based on the numbering pattern
        const items = textResponse.split(/\d+\. /).slice(1);
      
        // Return the array of parsed items
        // return items.map((item, index) => `${index + 1}. ${item.trim()}`);;
        return items.map(item => item.trim());
    }

    //find index of element in array function
    function findIndex(array: any[], value: any) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }

    const generatePseudocode = async (passedItem: string, index: number, id: number) => {
        try {
            if (index === 0) setPseudocode1Loading(true);
            if (index === 1) setPseudocode2Loading(true);
            if (index === 2) setPseudocode3Loading(true);
            if (index === 3) setPseudocode4Loading(true);
            if (index === 4) setPseudocode5Loading(true);
            
            // const res = await pseudocodeChain.call({ item: passedItem });
            // prod: 'https://flode.vercel.app/api/pseudocodechain'
            const res = await fetch('https://flode.vercel.app/api/pseudocodechain', {
                method: "put",
                body: JSON.stringify({ input: passedItem }),
            })

            console.log('res', res);

            const { response } = await res.json();

            console.log('res', res);

            if (index === 0) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('id', id);

                if (data) {
                    setPseudocode1Loading(false);
                    console.log('successfully updated pseudocode for item 1');
                }

                if (error) {
                    console.error('error updating pseudocode for item 1', error);
                }
            };
            if (index === 1) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('id', id);

                if (data) {
                    setPseudocode2Loading(false);
                    console.log('successfully updated pseudocode for item 2');
                }

                if (error) {
                    console.error('error updating pseudocode for item 2', error);
                }
            }
            if (index === 2) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('id', id);

                if (data) {
                    setPseudocode3Loading(false);
                    console.log('successfully updated pseudocode for item 3');
                }

                if (error) {
                    console.error('error updating pseudocode for item 3', error);
                }
            }
            if (index === 3) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('id', id);

                if (data) {
                    setPseudocode4Loading(false);
                    console.log('successfully updated pseudocode for item 4');
                }

                if (error) {
                    console.error('error updating pseudocode for item 4', error);
                }
            }
            if (index === 4) {
                const { data, error } = await supabase
                .from('todos')
                .update({ pseudocode: response.text })
                .eq('id', id);

                if (data) {
                    setPseudocode5Loading(false);
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

    //function that changes the is_complete value of a todo item to opposite of current value
    const toggleComplete = async (id: number, isComplete: boolean) => {
        try {
            const { data, error } = await supabase
            .from('todos')
            .update({ is_complete: !isComplete })
            .eq('id', id)
            .select();
            
            if (data) {
                setToggledCheckbox(!toggledCheckbox);
                console.log('successfully updated is_complete value');
            }

            if (error) {
                console.error('error updating is_complete value', error);
            }
        } catch (error) {
            console.error("Error when toggling complete: ", error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center p-2 bg-white">
            {loading && 
             <div className="flex flex-col w-full gap-4">
                 <Skeleton count={1} baseColor="gray" height={40} />
                 <div className="flex flex-col w-full gap-2">
                     <Skeleton count={1} baseColor="gray" height={90} />
                     <Skeleton count={1} baseColor="gray" height={90} />
                     <Skeleton count={1} baseColor="gray" height={90} />
                     <Skeleton count={1} baseColor="gray" height={90} />
                     <Skeleton count={1} baseColor="gray" height={90} />
                 </div>
             </div>
            }
            {props.idOfList && !loading && props.nameOfList &&
              <div className="flex flex-col justify-center items-center p-2 bg-white">
                <h1 className="text-4xl font-bold text-black text-start w-full mb-4">{props.nameOfList}</h1>
                {list.map((item: any) => (
                    <div key={item.id} className="flex flex-col gap-2 bg-gray rounded-lg shadow-lg w-full my-2 p-2 items-center border-none">
                        <div className="flex flex-row gap-1 items-center">
                        <input onClick={(e) => {
                            e.preventDefault();
                            toggleComplete(item.id, item.is_complete);
                        }} checked={item.is_complete} type="checkbox" className="h-5 w-5 rounded-full" />
                       <p className="font-mono text-center text-black p-2">{item.task}</p>
                       <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if (findIndex(list, item) === 0) {
                                setEditingItem1(true);
                            }
                            if (findIndex(list, item) === 1) {
                                setEditingItem2(true);
                            }
                            if (findIndex(list, item) === 2) {
                                setEditingItem3(true);
                            }
                            if (findIndex(list, item) === 3) {
                                setEditingItem4(true);
                            }
                            if (findIndex(list, item) === 4) {
                                setEditingItem5(true);
                            }
                          }}
                          className="rounded-md p-1 border-none bg-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"    className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                       </button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <button disabled={item.pseudocode} onClick={(e) => {
                            e.preventDefault();
                            generatePseudocode(item.task, 0, item.id);
                            
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
                       {editingItem1 && findIndex(list, item) === 0 &&  (
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
                                    editItem(findIndex(list, item), item.id);
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
                        {editingItem2 && findIndex(list, item) === 1 && (
                        <div className="flex flex-col gap-1 items-center">
                            <label className="text-black">what do you wanna change this item to?</label>
                            <input
                            value={editedItem2}
                            onChange={(e) => setEditedItem1(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono p-2 text-black"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full justify-center">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem(findIndex(list, item), item.id);
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem2(false);
                                 }} className="bg-black rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}
                        {editingItem3 && findIndex(list, item) === 2 && (
                        <div className="flex flex-col gap-1 items-center">
                            <label className="text-black">what do you wanna change this item to?</label>
                            <input
                            value={editedItem3}
                            onChange={(e) => setEditedItem3(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono p-2 text-black"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full justify-center">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem(findIndex(list, item), item.id);
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem3(false);
                                 }} className="bg-black rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}
                       {editingItem4 && findIndex(list, item) === 3 && (
                        <div className="flex flex-col gap-1 items-center">
                            <label className="text-black">what do you wanna change this item to?</label>
                            <input
                            value={editedItem2}
                            onChange={(e) => setEditedItem4(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono p-2 text-black"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full justify-center">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem(findIndex(list, item), item.id);
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem4(false);
                                 }} className="bg-black rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}

                       {editingItem5 && findIndex(list, item) === 4 && (
                        <div className="flex flex-col gap-1 items-center">
                            <label className="text-black">what do you wanna change this item to?</label>
                            <input
                            value={editedItem5}
                            onChange={(e) => setEditedItem5(e.target.value)}
                            className="bg-white w-full ring ring-gray-500 rounded-xl font-mono p-2 text-black"
                            placeholder="scaffold the app by running create-next-app@latest in my terminal"
                             />
                             <div className="flex flex-row items-center gap-2 w-full justify-center">
                                 <button className="bg-black rounded-xl p-2" onClick={(e) => {
                                    e.preventDefault();
                                    editItem(findIndex(list, item), item.id);
                                 }}>
                                    <p className="text-white text-center font-mono">save</p>
                                 </button>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    setEditingItem5(false);
                                 }} className="bg-black rounded-xl p-2">
                                    <p className="text-white font-mono text-center">cancel</p>
                                 </button>
                             </div>
                        </div>
                    )}
                    
                    {item.pseudocode && (
                        <div className="flex flex-col gap-2 bg-black rounded-lg shadow-lg w-full my-2 p-2 items-start">
                            <p className="font-mono text-center text-white p-2">{item.pseudocode}</p>
                        </div>
                    )}
                    {pseudocode1Loading && findIndex(list, item) === 0 && (
                         <div className="w-full">
                             <Skeleton height={40} baseColor="gray" />
                         </div>
                    )}
                    {pseudocode2Loading && findIndex(list, item) === 1 && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                    {pseudocode3Loading && findIndex(list, item) === 2 && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                    {pseudocode4Loading && findIndex(list, item) === 3 && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                    {pseudocode5Loading && findIndex(list, item) === 4 && (
                            <div className="w-full">
                                <Skeleton height={40} baseColor="gray" />
                            </div>
                    )}
                 </div>
                  ))}
              </div>
            }
        </div>
    )
}