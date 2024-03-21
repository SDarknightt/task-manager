import {ReactNode} from "react";
import {LucideIcon} from "lucide-react";

export interface SidebarItems {
    links: Array<{
        label: string;
        href: string;
        icon?: LucideIcon;
    }>;
    extras?: ReactNode;
}

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    disabled: boolean | null;
    tasks?: Task[] | null;
    boards?: Board[] | null;
}

export type Board ={
    id: string;
    title: string;
    description?: string;
    creationDate: Date;
    disabled: boolean;
    tasks?: Task[];
    users: User[];
}

export type Task = {
    id: string;
    boardId: string;
    responsibleId?: string | null;
    status: string;
    title: string;
    description: string | null;
    creationDate: Date;
    estimatedDate?: Date | null;
    endDate: Date | null;
    disabled: boolean;
    board?: Board;
    responsible?: User | null;
}
