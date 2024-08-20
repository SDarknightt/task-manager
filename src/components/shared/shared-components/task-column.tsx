import {type Task} from "~/utils/types";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";
import {Avatar, AvatarImage} from "~/components/ui/avatar";
import {Button} from "~/components/ui/button";
import {CalendarIcon, CheckCheck, Clock, RotateCw} from "lucide-react";
import {format} from "date-fns";
import {cn} from "~/lib/utils";
import * as React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
interface TaskColumnProps {
    tasks: Task[];
    title: string;
    color: string;
    updateTaskStatus: (id: string, status: string) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    setSelectedTask: (task: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({tasks, title, color, updateTaskStatus, setIsDialogOpen, setSelectedTask}) => {
    return (
        <div className={`flex flex-1 flex-col items-center justify-start min-w-80 p-10 overflow-hidden`}>
            <div className={"mb-3"}>
                <h4 className={`text-3xl font-bold text-${color}-500`}>{title}</h4>
                <Separator className={`bg-${color}-500`}/>
            </div>
            <div className={"space-y-2 sm:w-[80%] w-full"}>
                {tasks.map((task) => (
                    <Card key={task.id}
                        className={`w-full flex-shrink-0 border-${color}-500 cursor-pointer`}
                        onClick={() => {
                            setIsDialogOpen(true);
                            setSelectedTask(task);
                        }}>
                        <CardHeader>
                            <CardTitle className={"sm:text-lg text-md"}>{task.title}</CardTitle>
                            <Separator className={`bg-${color}-500`}/>
                        </CardHeader>
                        <CardContent>
                            <div className={"flex  flex-wrap xl:flex-row justify-between"}>
                                <div className="flex items-center">
                                    {task?.responsible?.image ?
                                        <>
                                            <Avatar className="w-[30px] h-[30px]">
                                                <AvatarImage src={task?.responsible?.image}/>
                                            </Avatar>
                                            <p className="text-sm text-foreground px-2">{task?.responsible?.name}</p>
                                        </>
                                        : <></>
                                    }
                                </div>
                                <div className="flex items-start">
                                    {task.estimatedDate ?
                                        <Button
                                            variant={"ghost"}
                                            className={cn(
                                                `w-auto pl-3 text-left font-normal border-${color}-500`,
                                                !task.estimatedDate && "text-muted-foreground"
                                            )}>
                                            {format(task.estimatedDate, "dd/MM/yyyy")}
                                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                                        </Button> : <></>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Select defaultValue={task.status}
                                    onValueChange={(value) => updateTaskStatus(task.id, value)}>
                                <SelectOption className={`border-${color}-500`}/>
                            </Select>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export function SelectOption(props: { className?: string }) {
    return (
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
export default TaskColumn;