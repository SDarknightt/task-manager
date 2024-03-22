import { useEffect, useState } from "react";
import {Avatar, AvatarImage} from "~/components/ui/avatar";
import {
    AlarmClock,
    CheckCircle,
    EditIcon,
    PlusIcon, RefreshCcw
} from "lucide-react";
import {useSession} from "next-auth/react";
import {Task} from "~/utils/types";
import {api} from "~/utils/api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";
import * as React from "react";
import {Button} from "~/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
export default function Home() {


    const sessionData = useSession();
    const apiContext = api.useContext();
    const useMutation = api.task.handleTaskStatus.useMutation();
    const [refetch, setRefetch] = useState(false);
    const [tasks, setTasks] = useState([] as Task[]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await apiContext.task.getTasks.fetch({boardId: 'cltz0g3qv0001c61t92f5n9q7'});
            if(response){
                setTasks(response);
            }
        }
        void fetchTasks();
        const pooling = setInterval(() => {
            void fetchTasks();
        }, 20000);

        return () => {
            clearInterval(pooling);
        }
    }, []);


    async function updatetask(id: string, status: string) {
        await useMutation.mutateAsync({id: id, status: status});
    }

    return (
        <div className="p-10 flex flex-col h-screen">
            <div className="mr-12"><OnlineUsers/></div>
            <div>
                <div>
                    <div
                        className=" md:min-w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
                        <Kanban tasks={tasks}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Kanban ({tasks}: {tasks: Task[]}){
    const [taskToDo, setTaskToDo] = useState([] as Task[]);
    const [taskDoing, setTaskDoing] = useState([] as Task[]);
    const [taskDone, setTaskDone] = useState([] as Task[]);
    const useMutation = api.task.handleTaskStatus.useMutation();
    async function updateTaskStatus(id: string, status: string) {
        await useMutation.mutateAsync({id: id, status: status});
    }


    useEffect(() => {
        if (tasks.length > 0) {
            setTaskToDo(tasks.filter((task) => task.status === 'TODO'));
            setTaskDoing(tasks.filter((task) => task.status === 'DOING'));
            setTaskDone(tasks.filter((task) => task.status === 'DONE'));
        }
    }, [tasks]);


    return (
            <div className="flex justify-between">
                <div key={"TODO"}
                     className="pt-16 flex flex-column md:flex-row flex-wrap justify-center items-start gap-8 border rounded-3xl flex-grow p-10 m-3 overflow-auto w-full min-w-[400px] min-h-[200px] border-red-500">
                <div>
                    <h4 className="text-3xl font-bold text-red-600">Para Fazer</h4>
                    <Separator/>
                </div>
                    {taskToDo.map((task) => (
                        <div key={task.id} className="relative">
                            <Card className="min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] flex-shrink-0 border-red-500">
                                <CardHeader>
                                    <CardTitle>{task.title}</CardTitle>
                                    <Separator/>
                                    <CardDescription>{task.description}</CardDescription>
                                </CardHeader>
                                <CardContent>

                                </CardContent>
                            </Card>
                            <div className="absolute bottom-4 left-2 right-2">
                                <Select defaultValue={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                                    <SelectTrigger>
                                        <SelectValue defaultValue="" placeholder="Selecione um status"/>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        <SelectItem value="TODO" className="flex items-center">
                                            <AlarmClock className="inline-block mr-2"/>
                                            <span className="inline-block">PARA FAZER</span>
                                        </SelectItem>
                                        <SelectItem value="DOING" className="flex items-center">
                                            <RefreshCcw className="inline-block mr-2"/>
                                            <span className="inline-block">FAZENDO</span>
                                        </SelectItem>
                                        <SelectItem value="DONE" className="flex items-center">
                                            <CheckCircle className="inline-block mr-2"/>
                                            <span className="inline-block">FEITO</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ))}

                </div>
                <div key={"DOING"} className="pt-16 flex flex-column md:flex-row flex-wrap justify-center items-start gap-8 border rounded-3xl flex-grow p-10 m-3 overflow-auto w-full min-w-[400px] border-yellow-500">
                <div>
                    <h4 className="text-3xl font-bold text-yellow-500">Fazendo</h4>
                    <Separator/>
                </div>
                {taskDoing.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] flex-shrink-0 border-yellow-500">
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <Separator/>
                                <CardDescription>{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                        <div className="absolute bottom-4 left-2 right-2">
                            <Select defaultValue={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                                <SelectTrigger>
                                    <SelectValue defaultValue="" placeholder="Selecione um status"/>
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    <SelectItem value="TODO" className="flex items-center">
                                        <AlarmClock className="inline-block mr-2"/>
                                        <span className="inline-block">PARA FAZER</span>
                                    </SelectItem>
                                    <SelectItem value="DOING" className="flex items-center">
                                        <RefreshCcw className="inline-block mr-2"/>
                                        <span className="inline-block">FAZENDO</span>
                                    </SelectItem>
                                    <SelectItem value="DONE" className="flex items-center">
                                        <CheckCircle className="inline-block mr-2"/>
                                        <span className="inline-block">FEITO</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
            <div key={"DONE"} className="pt-16 flex flex-column md:flex-row flex-wrap justify-center items-start gap-8 border rounded-3xl flex-grow p-10 m-3 overflow-auto w-full min-w-[400px] border-green-500">
                <div>
                    <h4 className="text-3xl font-bold text-green-500">Feito</h4>
                    <Separator/>
                </div>
                {taskDone.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] max-h-[300px] min-h-[300px] flex-shrink-0 border-green-500">
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <Separator/>
                                <CardDescription>{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                        <div className="absolute bottom-4 left-2 right-2">
                            <Select defaultValue={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                                <SelectTrigger>
                                    <SelectValue defaultValue="" placeholder="Selecione um status"/>
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    <SelectItem value="TODO" className="flex items-center">
                                        <AlarmClock className="inline-block mr-2"/>
                                        <span className="inline-block">PARA FAZER</span>
                                    </SelectItem>
                                    <SelectItem value="DOING" className="flex items-center">
                                        <RefreshCcw className="inline-block mr-2"/>
                                        <span className="inline-block">FAZENDO</span>
                                    </SelectItem>
                                    <SelectItem value="DONE" className="flex items-center">
                                        <CheckCircle className="inline-block mr-2"/>
                                        <span className="inline-block">FEITO</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}



export function OnlineUsers() {
    const sessionData = useSession();
    return (
        <div className="flex flex-initial justify-between">
            <div className="flex items-center">
                <h4 className="text-4xl font-bold text-foreground">Quadro</h4>
                <Button variant={"ghost"}><EditIcon className="w-10 h-10 text-gray-500  p-1 bg-white ml-5 shadow-xl"/></Button>
            </div>

            <ul className="flex space-x-3">
                <li className="max-w-[36px] max-h-[36px]">
                    <Avatar>
                        <AvatarImage className="rounded-[40px]" src={sessionData!.data!.user!.image}/>
                    </Avatar>
                </li>
                <li className="max-w-[36px] max-h-[36px]">
                    <Avatar>
                        <AvatarImage className="rounded-[40px]" src={sessionData!.data!.user!.image}/>
                    </Avatar>
                </li>
                <li className="max-w-[36px] max-h-[36px]">
                    <Avatar>
                        <AvatarImage className="rounded-[40px]" src={sessionData!.data!.user!.image}/>
                    </Avatar>
                </li>
                <li>
                    <button
                        className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center rounded-full">
                        <PlusIcon className="w-5 h-5 text-foreground"/>
                    </button>
                </li>
            </ul>
        </div>
    );
}











