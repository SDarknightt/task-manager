import {type Task, type User} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import DialogTasktDetails from "~/pages/boards/[boardId]/dialog/dialog-task-details";
import TaskColumn from "~/components/shared/shared-components/task-column";

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
        <div className="flex overflow-x-auto w-full sm:mx-0 mx-2 mb-3 min-h-screen">
            <div className="flex flex-nowrap w-full">
                <TaskColumn tasks={taskToDo} title="Para Fazer" color="red" updateTaskStatus={updateTaskStatus} setIsDialogOpen={setIsDialogOpen} setSelectedTask={setSelectedTask} />
                <TaskColumn tasks={taskDoing} title="Fazendo" color="yellow" updateTaskStatus={updateTaskStatus} setIsDialogOpen={setIsDialogOpen} setSelectedTask={setSelectedTask} />
                <TaskColumn tasks={taskDone} title="Feito" color="green" updateTaskStatus={updateTaskStatus} setIsDialogOpen={setIsDialogOpen} setSelectedTask={setSelectedTask} />
            </div>
            {isDialogOpen && selectedTask &&
                <DialogTasktDetails taskUpdate={selectedTask} users={users} isOpen={isDialogOpen}
                                    onClose={() => setIsDialogOpen(false)} fetchTasks={fetchTasks}/>}
        </div>
    )
}