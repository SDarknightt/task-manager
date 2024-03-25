import {type Board, type User} from "~/utils/types";
import {Button} from "~/components/ui/button";
import {EditIcon} from "lucide-react";
import {Avatar, AvatarImage} from "~/components/ui/avatar";
import * as React from "react";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import DialogInsertUser from "~/pages/boards/[boardId]/dialog/dialog-insert-user";
import {DialogUpdateBoard} from "~/pages/boards/dialog-update-board";

export function HeaderPage({board, pageName, refetchBoard}: {board?: Board, pageName?: string, refetchBoard?: () => void}){
    const apiContext = api.useContext();
    const [users, setUsers] = useState([] as User[]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchUsers = async () => {
        if(board){
            const response = await apiContext.board.getUsersOnBoard.fetch({boardId: board.id});
            if(response){
                setUsers(response);
            }
        }
    }

    useEffect(() => {
        const pooling = setInterval(() => {
            void fetchUsers();
        }, 20000);
        if(board){
            void fetchUsers();
        }

        return () => {
            clearInterval(pooling);
        }
    }, [board]);

    return (
        <div className="flex flex-initial justify-between">
            <div className="flex items-center">
                {board ?
                    <>
                        <h4 className="text-4xl font-bold text-foreground">{board?.title}</h4>
                        <Button variant={"ghost"} onClick={()=> setIsDialogOpen(true)}><EditIcon className="w-8 h-8 text-foreground shadow-xl"/></Button>
                    </>
                    : <h4 className="text-4xl font-bold text-foreground">{pageName}</h4>
                }
            </div>

            <ul className="flex space-x-3">
                { users.length > 0 ? users.map((user) => (
                    <li key={user?.id} className="max-w-[36px] max-h-[36px]">
                        <Avatar>
                            <AvatarImage className="rounded-[40px]" src={user?.image}/>
                        </Avatar>
                    </li>
                 )) : <></>
                }

                {board ?
                    <li>
                       <DialogInsertUser board={board}/>
                    </li>
                    : <></>
                }
            </ul>
            {isDialogOpen && refetchBoard && board && <DialogUpdateBoard refetchBoard={refetchBoard} board={board} users={users} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}/>}
        </div>
    );
}