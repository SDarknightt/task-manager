import {useRouter} from "next/router";
import {type Board, type Task, User} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import Loading from "~/components/shared/loading/loading";
import DialogCreateTask from "~/pages/boards/[boardId]/dialog-create-task";
import {Kanban} from "src/components/shared/kanban-board";
import {HeaderPage} from "src/components/shared/header-page";

export default function BoardDetails() {
    const router = useRouter();
    const [board, setBoard] = useState({} as Board);
    const [tasks, setTasks] = useState([] as Task[]);
    const boardURL = decodeURIComponent(router.query.boardId as string);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([] as User[]);
    const apiContext = api.useContext();

    const fetchUsers = async () => {
        try {
            const response = await apiContext.board.getUsersOnBoard.fetch({boardId: boardURL});
            if (response) {
                setUsers(response);
            }
        } catch (e) {
            console.error('Error getting users front');
        }
    }

    const fetchBoard = async () => {
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

        void fetchBoard();
        void fetchTasks();
        void fetchUsers();

        return () => {
            clearInterval(pooling);
        }
    }, []);

    return isLoading ?
        <Loading/> :
        <div>
            <h2 className="text-lg font-bold m-5 "><HeaderPage board={board}/></h2>
            <div
                className="md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div className="w-screen md:w-full -ml-5 md:ml-0 flex select-none justify-between">
                    <DialogCreateTask board={board} />
                </div>
                <div
                    className=" h-full flex flex-col md:justify-center align-middle items-center p-2">
                    <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    </div>
                    <Kanban users={users} tasks={tasks} fetchTasks={fetchTasks}/>
                </div>
            </div>
        </div>
}