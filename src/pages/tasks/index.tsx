import {useRouter} from "next/router";
import {type Task} from "~/utils/types";
import {useEffect, useState} from "react";
import {api} from "~/utils/api";
import * as React from "react";
import Loading from "~/components/shared/loading/loading";
import {Kanban} from "src/components/shared/kanban-board";
import {HeaderPage} from "src/components/shared/header-page";
import {HeaderTemplate, MainContent, SubContent} from "~/components/shared/shared-pages/page-components";
import Page from "~/components/shared/shared-pages/page";

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
        // const pooling = setInterval(() => {
        //     void fetchTasks();
        // }, 5000);

        void fetchTasks();

        // return () => {
        //     clearInterval(pooling);
        // }
    }, []);

    return isLoading ?
        <Loading/> :
        <Page>
            <HeaderTemplate>
                <HeaderPage pageName={"Minhas Tarefas"}/>
            </HeaderTemplate>
            <SubContent>
                <div className="flex w-full justify-end">
                </div>
            </SubContent>
            <MainContent>
                <Kanban tasks={tasks} fetchTasks={fetchTasks}/>
            </MainContent>
        </Page>
}