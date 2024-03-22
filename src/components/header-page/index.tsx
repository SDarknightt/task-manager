import {Board} from "~/utils/types";
import {Button} from "~/components/ui/button";
import {EditIcon, PlusIcon} from "lucide-react";
import {Avatar, AvatarImage} from "~/components/ui/avatar";
import * as React from "react";

export function HeaderPage({board, pageName}: {board?: Board, pageName?: string}) {
    return (
        <div className="flex flex-initial justify-between">
            <div className="flex items-center">
                {board ?
                    <h4 className="text-4xl font-bold text-foreground">{board?.title}</h4>
                    : <h4 className="text-4xl font-bold text-foreground">{pageName}</h4>
                }
                <Button variant={"ghost"}><EditIcon className="w-8 h-8 text-foreground shadow-xl"/></Button>
            </div>

            <ul className="flex space-x-3">
                { board ? board?.users?.map((user) => (
                    <li key={user.email} className="max-w-[36px] max-h-[36px]">
                        <Avatar>
                            <AvatarImage className="rounded-[40px]" src={user?.image}/>
                        </Avatar>
                    </li>
                 )) : <></>
                }
                <li>
                    <button className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center rounded-full">
                        <PlusIcon className="w-5 h-5 text-foreground"/>
                    </button>
                </li>
            </ul>
        </div>
    );
}