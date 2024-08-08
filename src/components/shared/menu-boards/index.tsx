import {Card, CardHeader, CardTitle} from "~/components/ui/card";
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
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full sm:mx-0 mx-2 mb-3">
                    {boardsProps.map((board) => (
                        <Card key={board.id} className="w-full min-h-[200px] flex-shrink-0 cursor-pointer"
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

