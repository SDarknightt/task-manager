import {useRouter} from "next/router";
import {type Board, type Task} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import DialogInsertUser from "~/pages/boards/[boardId]/dialog-insert-user";
import Loading from "~/components/shared/loading/loading";
import DialogCreateTask from "~/pages/boards/[boardId]/dialog-create-task";
import {Kanban} from "~/pages/others";

export default function BoardDetails() {
    const router = useRouter();
    const [board, setBoard] = useState({} as Board);
    const [tasks, setTasks] = useState([] as Task[]);
    const boardURL = decodeURIComponent(router.query.boardId as string);
    const [isLoading, setIsLoading] = useState(true);
    const apiContext = api.useContext();

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

    const fetchTasks = async () => {
        try {
            const responseTasks = await apiContext.task.getTasks.fetch({boardId: boardURL});
            if (responseTasks) {
                setTasks(responseTasks);
            }
        } catch (e) {
            console.error('Error getting tasks front');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const pooling = setInterval(() => {
            void fetchTasks();
        }, 5000);

        void fetch();
        void fetchTasks();

        return () => {
            clearInterval(pooling);
        }
    }, []);

    return isLoading ?
        <Loading/> :
        <div>
            <h2 className="text-lg font-bold m-5 ">{board?.title}</h2>
            <div
                className="md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none justify-between">
                    <DialogInsertUser board={board}/>
                    <DialogCreateTask board={board}/>
                </div>
                <div
                    className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                    <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    </div>
                    <Kanban tasks={tasks}/>
                </div>
            </div>
        </div>
}