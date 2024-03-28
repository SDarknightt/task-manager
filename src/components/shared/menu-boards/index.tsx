import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import * as React from "react";
import {Board} from "~/utils/types";
import {Separator} from "~/components/ui/separator";
import {useRouter} from "next/router";

export default function MenuBoards({boardsProps}: {boardsProps: Board[]}){
    const router = useRouter();
    function redirect(boardId: string) {
        void router.push(`/boards/` + encodeURIComponent(boardId));
    }

    return (
        <>
            {boardsProps.length > 0 ?
                <div
                    className="flex flex-column flex-wrap justify-center items-start gap-8 border flex-grow p-10 m-3 overflow-auto w-full rounded-3xl">
                    {boardsProps.map((board) => (
                        <Card key={board.id} className="min-w-[280px] w-[20%] min-h-[200px] flex-shrink-0 cursor-pointer"
                              onClick={() => redirect(board.id)}>
                            <CardHeader>
                                <CardTitle>{board?.title}</CardTitle>
                                <Separator/>
                                <p className="break-words text-gray-400">{board?.description}</p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                : <div className={"m-12"}>Nenhum quadro foi encontrado...</div>
            }

        </>
    );
}

