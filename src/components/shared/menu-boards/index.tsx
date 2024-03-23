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
            <div className="pl-20 pt-16 flex flex-column md:flex-row flex-wrap justify-start items-start gap-8 border flex-grow p-10 m-3 overflow-auto w-full rounded-3xl">
                {boardsProps.map((board) => (
                    <Card key={board.id} className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0"
                          onClick={() => redirect(board.id)}>
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
        </>
    );
}

