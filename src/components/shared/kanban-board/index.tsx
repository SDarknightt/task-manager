import {type Task, type User} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import {Separator} from "~/components/ui/separator";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {CalendarIcon, CheckCheck, Clock, RotateCw} from "lucide-react";
import * as React from "react";
import {Avatar, AvatarImage} from "~/components/ui/avatar";
import {DialogTasktDetails} from "~/pages/boards/[boardId]/dialog/dialog-task-details";
import {Button} from "~/components/ui/button";
import {cn} from "~/lib/utils";
import {format} from "date-fns";

export function Kanban ({tasks, fetchTasks, users}: {tasks: Task[], fetchTasks: () => void, users?: User[]}){
    const [taskToDo, setTaskToDo] = useState([] as Task[]);
    const [taskDoing, setTaskDoing] = useState([] as Task[]);
    const [taskDone, setTaskDone] = useState([] as Task[]);
    const useMutation = api.task.handleTaskStatus.useMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task>({} as Task);

    async function updateTaskStatus(id: string, status: string) {
        await useMutation.mutateAsync({id: id, status: status});
        void fetchTasks();
    }

    useEffect(() => {
        if (tasks) {
            setTaskToDo(tasks.filter((task) => task.status === 'TODO'));
            setTaskDoing(tasks.filter((task) => task.status === 'DOING'));
            setTaskDone(tasks.filter((task) => task.status === 'DONE'));
        }
    }, [tasks]);


    return (
        <div className="flex">
            <div key={"TODO"} className="flex-1 pt-16 flex flex-col items-center justify-start gap-8 rounded-3xl p-10 m-3 overflow-auto">
                <div>
                    <h4 className="text-3xl font-bold text-red-600">Para Fazer</h4>
                    <Separator className=""/>
                </div>
                {taskToDo.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0 border-red-500 cursor-pointer" onClick={() => {setIsDialogOpen(true); setSelectedTask(task);}}>
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <Separator className="bg-red-500"/>
                            </CardHeader>
                            <CardContent>
                                <div className={"flex justify-between"}>
                                    <span className="flex items-center">
                                        {task?.responsible?.image ?
                                            <>
                                                <Avatar className="w-[30px] h-[30px]">
                                                    <AvatarImage src={task?.responsible?.image}/>
                                                </Avatar>
                                                <p className="text-sm text-foreground px-2">{task?.responsible?.name}</p>
                                            </>
                                            : <></>
                                        }
                                   </span>

                                    <div className="flex items-start">
                                        {task.estimatedDate ?
                                            <Button
                                                variant={"ghost"}
                                                className={cn(
                                                    "w-auto pl-3 text-left font-normal border-red-500",
                                                    !task.estimatedDate && "text-muted-foreground"
                                                )}>
                                                {format(task.estimatedDate, "dd/MM/yyyy")}
                                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                                            </Button> : <></>}
                                    </div>
                                </div>
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

            <div key={"DOING"} className="flex-1 pt-16 flex flex-col items-center justify-start gap-8 rounded-3xl m-3 overflow-auto w-full ">
                <div>
                    <h4 className="text-3xl font-bold text-yellow-500">Fazendo</h4>
                    <Separator/>
                </div>
                {taskDoing.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0 border-yellow-500 cursor-pointer" onClick={() => {setIsDialogOpen(true); setSelectedTask(task);}} >
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <Separator className="bg-yellow-500"/>
                            </CardHeader>
                            <CardContent>
                                <div className={"flex justify-between"}>
                                    <span className="flex items-center">
                                        {task?.responsible?.image ?
                                            <>
                                                <Avatar className="w-[30px] h-[30px]">
                                                    <AvatarImage src={task?.responsible?.image}/>
                                                </Avatar>
                                                <p className="text-sm text-foreground px-2">{task?.responsible?.name}</p>
                                            </>
                                            : <></>
                                        }
                                   </span>

                                    <div className="flex items-start">
                                        {task.estimatedDate ?
                                            <Button
                                                variant={"ghost"}
                                                className={cn(
                                                    "w-auto pl-3 text-left font-normal border-yellow-500",
                                                    !task.estimatedDate && "text-muted-foreground"
                                                )}>
                                                {format(task.estimatedDate, "dd/MM/yyyy")}
                                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                                            </Button> : <></>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="absolute bottom-4 left-2 right-2">
                            <Select defaultValue={task.status}
                                    onValueChange={(value) => updateTaskStatus(task.id, value)}>
                                <SelectOption className={"border-yellow-500"}/>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>

            <div key={"DONE"} className="flex-1 pt-16 flex flex-col items-center justify-start gap-8 rounded-3xl p-10 m-3 overflow-auto w-full ">
                <div>
                    <h4 className="text-3xl font-bold text-green-500">Feito</h4>
                    <Separator/>
                </div>
                {taskDone.map((task) => (
                    <div key={task.id} className="relative">
                        <Card className="min-w-[300px] max-w-[300px] min-h-[200px] flex-shrink-0 border-green-500 cursor-pointer"
                              onClick={() => {
                                  setIsDialogOpen(true);
                                  setSelectedTask(task);
                              }}>
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <Separator className="bg-green-500"/>
                            </CardHeader>
                            <CardContent>
                                <div className={"flex justify-between"}>
                                    <span className="flex items-center">
                                        {task?.responsible?.image ?
                                            <>
                                                <Avatar className="w-[30px] h-[30px]">
                                                    <AvatarImage src={task?.responsible?.image}/>
                                                </Avatar>
                                                <p className="text-sm text-foreground px-2">{task?.responsible?.name}</p>
                                            </>
                                            : <></>
                                        }
                                   </span>

                                    <div className="flex items-start">
                                        {task.estimatedDate ?
                                            <Button
                                                variant={"ghost"}
                                                className={cn(
                                                    "w-auto pl-3 text-left font-normal border-green-500",
                                                    !task.estimatedDate && "text-muted-foreground"
                                                )}>
                                                {format(task.estimatedDate, "dd/MM/yyyy")}
                                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                                            </Button> : <></>}
                                    </div>
                                </div>
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
            {isDialogOpen && selectedTask && <DialogTasktDetails taskUpdate={selectedTask} users={users} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} fetchTasks={fetchTasks}/>}
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