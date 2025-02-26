import {XCircleIcon} from "lucide-react";
import React from "react";
import {Button} from "@/components/ui/button";



export default function NotificationCard({className = ""}){
    return(
        <>
            <div className={`flex bg-gray-100 dark:bg-gray-900 items-center justify-between  rounded-lg relative ${className}`}>
                <div className="flex items-start  dark:bg-gray-900 gap-1 py-2 px-3 flex-col w-[85%]">
                    <div className="flex  gap-2  dark:bg-gray-900 justify-start items-center">
                        <div
                            className={`size-2 rounded-full `}></div>
                        <p className="text-small-1  dark:bg-gray-900 font-semibold text-black-100 dark:text-gray-400 group-hover:underline cursor-pointer">Sydonie
                            RATOVOMARO posted a new recipe : coconut ice cream</p>
                    </div>


                    <p className="pl-3 text-small-2 text-black-100 dark:text-gray-200  dark:font-sm">3 min ago</p>
                </div>
                <button                    
                    type="button"
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md dark:bg-secondary-dark dark:hover:bg-secondary-dark/50"
                    
                >
                    <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-500"/>
                </button>
            </div>
        </>
    )
}