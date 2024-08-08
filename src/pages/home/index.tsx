import {api} from "~/utils/api";
import * as React from "react"
import Loading from "~/components/shared/loading/loading";
import {useEffect, useState} from "react";
import {Board, Task} from "~/utils/types";
import {useRouter} from "next/router";
import MenuBoards from "~/components/shared/menu-boards";
import {CheckCheck, Clock, RotateCw} from "lucide-react";
import Page from "~/components/shared/shared-pages/page";
import {
    HeaderTemplate,
    SubContent, MainContent
} from "~/components/shared/shared-pages/page-components";
import {HeaderPage} from "~/components/shared/header-page";
import StatusCard from "~/components/shared/shared-components/card-status";

export default function Home() {
    const [boards, setBoards] = useState([] as Board[]);
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([] as Task[]);
    const apiContext = api.useContext();
    const router = useRouter();

    const fetchUserTasks = async () => {
        try{
            const response = await apiContext.task.getUserTasks.fetch();
            if(response){
                setTasks(response);
            }
        } catch (e) {
            console.error("Error fetching user tasks - home page");
        }
    }


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
        void fetchUserTasks();

        const pooling = setInterval(() =>{
            void fetchBoard();
        }, 5000);

        return () => {
            clearInterval(pooling);
        }
    }, []);


    return isLoading ?
        <Loading/> :
        <Page>
            <HeaderTemplate>
                <HeaderPage pageName={"Home"} />
            </HeaderTemplate>
            <SubContent>
                <StatusTaks tasks={tasks} />
            </SubContent>
            <MainContent>
                <MenuBoards boardsProps={boards} />
            </MainContent>
        </Page>
}



export function StatusTaks({tasks}: {tasks: Task[]}){

    const [taskToDo, setTaskToDo] = useState(0 as number);
    const [taskDoing, setTaskDoing] = useState(0 as number);
    const [taskDone, setTaskDone] = useState(0 as number);

    useEffect(() => {
        if (tasks.length > 0) {
            setTaskToDo(tasks.filter((task) => task.status === 'TODO').length);
            setTaskDoing(tasks.filter((task) => task.status === 'DOING').length);
            setTaskDone(tasks.filter((task) => task.status === 'DONE').length);
        }
    }, []);

    return (
        <div className="flex select-none w-full flex-col space-y-3
            sm:justify-between sm:flex-row sm:items-center">
            <StatusCard title="Para Fazer" icon={<Clock className="inline-block mr-2 text-red-500" />} value={taskToDo} />
            <StatusCard title="Fazendo" icon={<RotateCw className="inline-block mr-2 text-yellow-500" />} value={taskDoing} />
            <StatusCard title="Feitas" icon={<CheckCheck className="inline-block mr-2 text-green-500" />} value={taskDone} />
        </div>
    );
}
