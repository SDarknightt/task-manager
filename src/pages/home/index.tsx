import {api} from "~/utils/api";
import * as React from "react"
import Loading from "~/components/shared/loading/loading";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {useEffect, useState} from "react";
import {Board} from "~/utils/types";
import {useRouter} from "next/router";
import {Separator} from "~/components/ui/separator";
import {HeaderPage} from "src/components/header-page";

export default function Home() {
    const [boards, setBoards] = useState([] as Board[]);
    const [isLoading, setIsLoading] = useState(true);
    const apiContext = api.useContext();
    const router = useRouter();

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

    function redirectBoard(boardId: string) {
        void router.push(`/boards/${boardId}`);
    }

    return isLoading ?
        <Loading/> :
        <div>
            <h2 className="text-lg font-bold m-5 "><HeaderPage pageName={"Home"}/></h2>
            <div className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                </div>
                <div className="pl-20 pt-16 flex flex-column md:flex-row flex-wrap justify-start items-start gap-8 border rounded-sm flex-grow p-10 m-3 overflow-auto w-full">
                    {boards.map((board) => (
                        <Card key={board.id} className="min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] flex-shrink-0 border-accent-foreground"
                              onClick={() => redirectBoard(board.id)}>
                            <CardHeader>
                                <CardTitle>{board?.title}</CardTitle>
                                <Separator/>
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