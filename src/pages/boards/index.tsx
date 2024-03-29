import {api} from "~/utils/api";
import * as React from "react"
import DialogCreateBoard from "~/pages/boards/dialog-create-board";
import {useEffect, useState} from "react";
import {Board} from "~/utils/types";
import Loading from "~/components/shared/loading/loading";
import {HeaderPage} from "src/components/shared/header-page";
import MenuBoards from "~/components/shared/menu-boards";
import {Button} from "~/components/ui/button";
import {Plus} from "lucide-react";

export default function Boards() {
    const [boards, setBoards] = useState([] as Board[]);
    const [isLoading, setIsLoading] = useState(true);
    const apiContext = api.useContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchBoard = async () => {
        try {
            const responseBoard = await apiContext.board.getBoards.fetch();
            if (responseBoard) {
                setBoards(responseBoard);
            }
        } catch (error) {
            throw new Error("Error fetching boards client");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void fetchBoard();
        const pooling = setInterval(() =>{
            void fetchBoard();
        }, 5000);

        return () => {
            clearInterval(pooling);
        }
    }, []);

    return isLoading ?
        <Loading/> :
        <div className="flex flex-col">
            <h2 className="text-lg font-bold m-5 "><HeaderPage pageName={"Quadros"}/></h2>
            <div
                className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    <Button variant="default" onClick={() => setIsDialogOpen(true)}><Plus/> Quadro</Button>
                </div>
                <MenuBoards boardsProps={boards}/>
                { isDialogOpen && <DialogCreateBoard isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} fetchBoards={fetchBoard}/>}
            </div>
        </div>
}