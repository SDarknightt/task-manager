import {useRouter} from "next/router";
import {type Board, type Task, User} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import Loading from "~/components/shared/loading/loading";
import DialogCreateTask from "~/pages/boards/[boardId]/dialog/dialog-create-task";
import {Kanban} from "src/components/shared/kanban-board";
import {HeaderPage} from "src/components/shared/header-page";
import {Button} from "~/components/ui/button";
import {CalendarIcon, Plus, Trash} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import useDebounce from "~/utils/hooks/use-debounce";
import {format, subDays} from "date-fns";
import {Calendar} from "~/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {DateRange} from "react-day-picker";
import {cn} from "~/lib/utils";
import {toast} from "~/components/ui/use-toast";
import {HeaderTemplate, MainContent, SubContent} from "~/components/shared/shared-pages/page-components";
import Page from "~/components/shared/shared-pages/page";

export default function BoardDetails() {
    const router = useRouter();
    const [board, setBoard] = useState({} as Board);
    const [tasks, setTasks] = useState([] as Task[]);
    const boardURL = decodeURIComponent(router.query.boardId as string);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([] as User[]);
    const apiContext = api.useContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        <Page>
            <HeaderTemplate>
                <HeaderPage board={board} refetchBoard={fetchBoard}/>
            </HeaderTemplate>
            <SubContent>
                <div className="flex w-full justify-end">
                    <Button variant="default" className="justify-end sm:mx-0 mx-4" onClick={() => setIsDialogOpen(true)}><Plus/> Tarefa</Button>
                    {isDialogOpen && board && <DialogCreateTask board={board} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} fetchTasks={fetchTasks}/>}
                </div>
            </SubContent>
            <MainContent>
                <Tabs defaultValue="kanban" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="kanban">Kanban</TabsTrigger>
                        <TabsTrigger value="log">Estatísticas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="kanban" defaultChecked>
                        <Kanban tasks={tasks} fetchTasks={fetchTasks} users={users}/>
                    </TabsContent>
                    <TabsContent value="log">
                        <TasksLog board={board}/>
                    </TabsContent>
                </Tabs>
            </MainContent>
        </Page>
}



export function TasksLog({board}:{board: Board}) {
    const [tasks, setTasks] = useState([] as Task[]);
    const [query, setQuery] = useState("");
    const debouncedSearch = useDebounce(query, 500);
    const apiContext = api.useContext();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const deleteMutation = api.task.deleteTask.useMutation();

    const fetchDisabledTasks = async () => {
        const tasks = await apiContext.task.getTasks.fetch({boardId: board.id, disabled: true, query: query, startDate: startDate, endDate: endDate});
        if(tasks){
            setTasks(tasks);
        }
    }

    async function deleteTask(taskId: string) {
        console.log("taskId", taskId);
        const deleteTask = await deleteMutation.mutateAsync({taskId: taskId});
        if (deleteTask) {
            void fetchDisabledTasks();
            toast({
                title: "Sucesso!",
                description: "Tarefa deletada com sucesso.",
            })
        } else {
            toast({
                title: "Erro!",
                description: "Erro ao deletar tarefa.",
            })
        }
    }


    useEffect(() => {
        void fetchDisabledTasks();
        const pooling = setInterval(() => {
            void fetchDisabledTasks();
        }, 5000);

        debouncedSearch ? setQuery(query) : '';

        return () => {
            clearInterval(pooling);
        }
    }, [debouncedSearch, startDate, endDate]);

    return (
        <div className=" h-full flex flex-col justify-start align-middle items-center">
            <div className="flex sm:flex-row flex-col w-full sm:justify-between">
                <div className="flex flex-1 items-center">
                    <div className="w-full mx-2 sm:w-3/5 sm:mx-0">
                        <Label htmlFor="query">Filtro de busca</Label>
                        <Input type="text" id="query" className="mb-2" placeholder="Filtro" onChange={e => {
                            setQuery(e.target.value)
                        }}/>
                    </div>
                </div>
                <div className={"flex flex-1 justify-end"}>
                    <div className={"w-3/5 sm:mx-0 mx-2 "}>
                        <DatePickerWithRange setEndDate={setEndDate} setStartDate={setStartDate}/>
                    </div>
                </div>
            </div>

            <div className="w-full mt-3 h-screen">
                <Table className="items-center rounded-md">
                    <TableCaption>Lista de tarefas finalizadas</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titulo</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Data de Finalização</TableHead>
                            <TableHead>Deletar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task?.responsible?.name ? task?.responsible?.name : "-" }</TableCell>
                                <TableCell>{format(task.creationDate, "dd/MM/yyyy")}</TableCell>
                                <TableCell>{task?.endDate ? format(task.endDate, "dd/MM/yyyy") : "-"}</TableCell>
                                <TableCell><Button variant={"destructive"} onClick={() => deleteTask(task.id)}><Trash/></Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={10}>Total de tarefas: {tasks.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}

export function DatePickerWithRange({
                                        className, setStartDate, setEndDate
                                    }: React.HTMLAttributes<HTMLDivElement> & { setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>, setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>> }) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 15),
        to:new Date(),
    })

    useEffect(() => {
        if (date) {
            setStartDate(date.from);
            setEndDate(date.to);
        }
    }, [date]);

    return (
        <div className={cn("grid gap-2 mb-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd/MM/yyyy")} -{" "}
                                    {format(date.to, "dd/MM/yyyy")}
                                </>
                            ) : (
                                format(date.from, "dd/MM/yyyy")
                            )
                        ) : (
                            <span>Selecione o Intervalo</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}