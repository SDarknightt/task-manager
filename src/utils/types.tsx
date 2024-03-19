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
    name: string;
    email: string;
    disabled: boolean;
    tasks?: Task[];
    boards?: Board[];
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
    title: string;
    description: string;
    creationDate: Date;
    estimatedDate: Date;
    endDate: Date;
    disabled: boolean;
    board: Board;
    responsible?: User;
}