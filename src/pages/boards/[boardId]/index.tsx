import {useRouter} from "next/router";
import {Board} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import DialogInsertUser from "~/pages/boards/[boardId]/dialog-insert-user";
import Loading from "~/components/shared/loading/loading";

export default function BoardDetails() {
    const router = useRouter();
    const [board, setBoard] = useState({} as Board);
    const boardURL = decodeURIComponent(router.query.boardId as string);
    const [isLoading, setIsLoading] = useState(true);
    const apiContext = api.useContext();

    useEffect(  () => {
        const fetch = async () => {
            try {
                if (boardURL) {
                    const details =  await apiContext.board.getBoardDetails.fetch({boardId: boardURL});
                    if (details) {
                        setBoard(details);
                    }
                }
            } catch (e) {
                console.error('Error getting board details front');
            } finally {
                setIsLoading(false);
            }
        }
        void fetch();
    }, []);

    return isLoading ?
        <Loading/> :
        <div>
            <h2 className="text-lg font-bold m-5 ">{board?.title}</h2>
            <div
                className="md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    <DialogInsertUser board={board}/>
                </div>
                <div className="w-screen md:w-full md:overflow-hidden justify-center border rounded-sm m-3">
                    <div className="border-slate-900">
                        <div className="flex flex-col items-center justify-center gap-4 h-screen">

                        </div>
                    </div>
                </div>
            </div>
        </div>
}