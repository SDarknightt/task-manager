import {Task} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import {Separator} from "~/components/ui/separator";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import { CheckCheck, Clock, RotateCw} from "lucide-react";
import * as React from "react";

export function Kanban ({tasks, fetchTasks}: {tasks: Task[], fetchTasks: () => void}){
    const [taskToDo, setTaskToDo] = useState([] as Task[]);
    const [taskDoing, setTaskDoing] = useState([] as Task[]);
    const [taskDone, setTaskDone] = useState([] as Task[]);
    const useMutation = api.task.handleTaskStatus.useMutation();
    async function updateTaskStatus(id: string, status: string) {
        await useMutation.mutateAsync({id: id, status: status});
        void fetchTasks;
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
                 className="flex-grow-0  pt-16 flex flex-col items-center justify-start  gap-8 rounded-3xl p-10 m-3 overflow-auto w-full min-w-[400px]">
                <div>
                    <h4 className="text-3xl font-bold text-red-600">Para Fazer</h4>
                    <Separator className=""/>
                </div>
                {taskToDo.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0 border-red-500">
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
                                <SelectOption className={"border-red-500"}/>
                            </Select>
                        </div>
                    </div>
                ))}

            </div>
            <div key={"DOING"} className="flex-grow-0 pt-16 flex flex-col items-center justify-start  gap-8 rounded-3xl p-10 m-3 overflow-auto w-full min-w-[400px]">
                <div>
                    <h4 className="text-3xl font-bold text-yellow-500">Fazendo</h4>
                    <Separator/>
                </div>
                {taskDoing.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0 border-yellow-500">
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
                                <SelectOption className={"border-yellow-500"}/>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
            <div key={"DONE"} className="flex-grow-0 pt-16 flex flex-col items-center justify-start  gap-8 rounded-3xl p-10 m-3 overflow-auto w-full min-w-[400px]">
                <div>
                    <h4 className="text-3xl font-bold text-green-500">Feito</h4>
                    <Separator/>
                </div>
                {taskDone.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0 border-green-500">
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
                                <SelectOption className={"border-green-500"}/>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function SelectOption(props:{className?: string}){
    return(
        <>
            <SelectTrigger className={`border ${props.className}`}>
                <SelectValue defaultValue="" placeholder="Selecione um status"/>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="TODO" className="flex items-center">
                    <Clock className="inline-block mr-2 text-red-500"/>
                    <span className="inline-block">PARA FAZER</span>
                </SelectItem>
                <SelectItem value="DOING" className="flex items-center">
                    <RotateCw className="inline-block mr-2 text-yellow-500"/>
                    <span className="inline-block">FAZENDO</span>
                </SelectItem>
                <SelectItem value="DONE" className="flex items-center">
                    <CheckCheck className="inline-block mr-2 text-green-500"/>
                    <span className="inline-block">FEITO</span>
                </SelectItem>
            </SelectContent>
        </>
    )
}