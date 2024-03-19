import {useRouter} from "next/router";
import {Board} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";

export default function BoardDetails() {
    const router = useRouter();
    const [board, setBoard] = useState({} as Board);
    const boardURL = decodeURIComponent(router.query.boardId as string);
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
            }
        }
        void fetch();
    }, []);

    return(
        <div>
            <h2 className="text-lg font-bold m-5 ">{board?.title}</h2>
            <div className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-around select-none">
                <h3 className="font-bold">Testando</h3>
                </div>
                <div className="w-screen md:w-full md:overflow-hidden justify-center border rounded-sm">
                    <div className="border-slate-900">
                        <div className="flex flex-col items-center justify-center gap-4 h-screen">
                            <p className="text-center text-2xl">
                                BoardDetails
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}