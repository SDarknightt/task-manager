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
import Page from "~/components/shared/shared-pages/page";
import {HeaderTemplate, MainContent, SubContent} from "~/components/shared/shared-pages/page-components";

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
        // const pooling = setInterval(() =>{
        //     void fetchBoard();
        // }, 5000);
        //
        // return () => {
        //     clearInterval(pooling);
        // }
    }, []);

    return isLoading ?
        <Loading/> :
        <Page>
            <HeaderTemplate>
                <HeaderPage pageName={"Quadros"}/>
            </HeaderTemplate>
            <SubContent>
                <div className="flex w-full justify-end">
                    <Button variant="default" className={"sm:mx-0 mx-2"} onClick={() => setIsDialogOpen(true)}><Plus/> Quadro</Button>
                </div>
            </SubContent>
            <MainContent>
                <MenuBoards boardsProps={boards}/>
                { isDialogOpen && <DialogCreateBoard isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} fetchBoards={fetchBoard}/> }
           </MainContent>
        </Page>
}