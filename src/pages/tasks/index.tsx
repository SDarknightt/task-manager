import {Board, type Task} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import Loading from "~/components/shared/loading/loading";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";

export default function MyTasks() {
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
            console.error('Error getting tasks front');
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
            <h2 className="text-lg font-bold m-5 ">Minhas Tarefas</h2>
            <div
                className="md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                <div
                    className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                    <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-end select-none">
                    </div>
                    <div
                        className="pl-20 pt-16 flex flex-column md:flex-row flex-wrap justify-start items-start gap-8 border rounded-sm flex-grow p-10 m-3 overflow-auto w-full">
                        {tasks.map((task) => (
                            <Card key={task.id}
                                  className="min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] flex-shrink-0 border-accent-foreground">
                                <CardHeader>
                                    <CardTitle>{task?.title}</CardTitle>
                                    <Separator/>
                                    <CardDescription>
                                        <p className="font-bold"><span className="text-foreground"> Status: </span> {task?.status}</p>
                                        <p className="font-bold"><span className="text-foreground"> Quadro: </span> {task?.board?.title}</p>
                                        <p className="font-bold mb-3"><span className="text-foreground">Responsavel: </span> {task?.responsible?.name}</p>
                                        <p>{task?.description}</p>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
}
