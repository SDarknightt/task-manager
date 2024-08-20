'use client';
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {useSession} from "next-auth/react";
import * as React from "react";

export default function UserItem(){
    const { data: sessionData } = useSession();

    return (
        <div className="flex items-center justify-center gap-2 border rounded-[40px] p-4 cursor-pointer">
            <div className="avatar rounded-full min-h-12 min-w-12 bg-emerald-500 text-white flex item items-center font-[700] justify-center">
                { sessionData?.user?.image ?
                    <p>
                        <Avatar>
                            <AvatarImage className="rounded-[40px]" src={sessionData?.user?.image ? sessionData?.user?.image : undefined}/>
                            <AvatarFallback>{sessionData?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </p> :
                    <p className="text-[25px]">
                        {sessionData?.user?.name?.charAt(0)}
                    </p>
                }
            </div>
            <div>
                <p className="text-[16px] font-bold">{sessionData?.user?.name}</p>
                <p className="text-[14px] text-neutral-500">{sessionData?.user?.email}</p>
            </div>
        </div>
    );
}