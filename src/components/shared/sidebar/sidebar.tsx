'use client'

import UserItem from "~/components/shared/user-item/user-item";

export default function Sidebar(){
    return (
        <div className={` gap-4 flex flex-col w-[300px] min-w-[300px] border-r border-b min-h-screen p-4`}>
            <div><UserItem/></div>
            <div className="grow">
                Sidebar items aqui!
            </div>
        </div>
    );
}

