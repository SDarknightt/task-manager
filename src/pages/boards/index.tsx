import {api} from "~/utils/api";
import * as React from "react"
import DialogCreateBoard from "~/pages/boards/dialog-create-board";
import {useEffect, useState} from "react";
import {Board} from "~/utils/types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {router} from "next/client";
import Loading from "~/components/shared/loading/loading";


export default function Boards() {
    const [boards, setBoards] = useState([] as Board[]);
    const [isLoading, setIsLoading] = useState(true);
    const apiContext = api.useContext();

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
        <div>
            <h2 className="text-lg font-bold m-5 ">Quadros</h2>
            <div
                className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    <DialogCreateBoard/>
                </div>
                <div
                    className="flex flex-column md:flex-row flex-wrap justify-around items-start gap-8 border rounded-sm flex-grow p-10 m-3 overflow-auto">
                    {boards.map((board) => (
                        <Card key={board?.id} className="min-w-[350px] min-h-[350px] flex-shrink-0"
                              onClick={() => redirect(board?.id)}>
                            <CardHeader>
                                <CardTitle>{board?.title}</CardTitle>
                                <CardDescription>{board?.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
}

function redirect(boardId: string) {
    void router.push(`/boards/` + encodeURIComponent(boardId));
}