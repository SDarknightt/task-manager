import {useRouter} from "next/router";
import {type Board, type Task, User} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import Loading from "~/components/shared/loading/loading";
import DialogCreateTask from "~/pages/boards/[boardId]/dialog/dialog-create-task";
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
            <h2 className="text-lg font-bold m-5 "><HeaderPage board={board} refetchBoard={fetchBoard}/></h2>
            <div className="flex justify-start">
                <DialogCreateTask board={board}/>
            </div>
            <div className="h-full flex align-middle p-2">
                <div className="h-full w-full flex flex-col align-middle p-2 justify-center">
                    <Kanban tasks={tasks} fetchTasks={fetchTasks} users={users}/>
                </div>
            </div>
        </div>
}



