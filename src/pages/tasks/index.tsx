import {useRouter} from "next/router";
import {type Task} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import Loading from "~/components/shared/loading/loading";
import {Kanban} from "~/components/kanban-board";
import {HeaderPage} from "src/components/header-page";

export default function MyTasks() {
    const router = useRouter();
    const [tasks, setTasks] = useState([] as Task[]);
    const [isLoading, setIsLoading] = useState(true);
    const apiContext = api.useContext();

    const fetchTasks = async () => {
        try {
            const responseTasks = await apiContext.task.getUserTasks.fetch();
            if (responseTasks) {
                setTasks(responseTasks);
            }
        } catch (e) {
            console.error('Error getting user tasks front');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const pooling = setInterval(() => {
            void fetchTasks();
        }, 5000);

        void fetchTasks();

        return () => {
            clearInterval(pooling);
        }
    }, []);

    return isLoading ?
        <Loading/> :
        <div>
            <h2 className="text-lg font-bold m-5 "><HeaderPage pageName={"Minhas Tarefas"}/></h2>
            <div
                className="md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div
                    className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                    <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    </div>
                    <Kanban tasks={tasks} fetchTasks={fetchTasks}/>
                </div>
            </div>
        </div>
}