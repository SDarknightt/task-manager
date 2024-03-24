import {api} from "~/utils/api";
import * as React from "react"
import Loading from "~/components/shared/loading/loading";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {useEffect, useState} from "react";
import {Board, Task} from "~/utils/types";
import {useRouter} from "next/router";
import {Separator} from "~/components/ui/separator";
import {HeaderPage} from "src/components/shared/header-page";
import MenuBoards from "~/components/shared/menu-boards";
import {CheckCheck, Clock, RotateCw} from "lucide-react";

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
        <div className="flex flex-col">
            <h2 className="text-lg font-bold m-5 "><HeaderPage pageName={"Home"}/></h2>

            <StatusTaks tasks={tasks}/>

            <div className="w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <MenuBoards boardsProps={boards}/>
            </div>
        </div>
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
        <div className="w-[82vw] h-full flex flex-row align-middle justify-center p-2 md:p-14 ">
            <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-between px-10 select-none">
                <Card className="min-w-[30%] flex-shrink-0">
                    <CardHeader className="flex items-center">
                        <CardTitle>Para Fazer</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <h4 className="text-4xl font-bold text-foreground">
                            <Clock className="inline-block mr-2 text-red-500 text-8xl"/>{taskToDo}
                        </h4>
                    </CardContent>
                </Card>
                <Card className="min-w-[30%] flex-shrink-0">
                    <CardHeader className="flex items-center">
                        <CardTitle>Fazendo</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <h4 className="text-4xl font-bold text-foreground">
                            <RotateCw className="inline-block mr-2 text-yellow-500"/>{taskDoing}
                        </h4>
                    </CardContent>
                </Card>
                <Card className="min-w-[30%] flex-shrink-0">
                    <CardHeader className="flex items-center">
                        <CardTitle>Feitas</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <h4 className="text-4xl font-bold text-foreground">
                            <CheckCheck className="inline-block mr-2 text-green-500 text-8xl"/>{taskDone}
                        </h4>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}