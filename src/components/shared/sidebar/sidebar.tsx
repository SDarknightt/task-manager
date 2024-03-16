'use client';

import {
    Bell,
    Bookmark,
    Home,
    List,
    Mail, MapPin,
    MoreHorizontal, Plus,
    User,
    Users,
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarButton } from './sidebar-button';
import {SidebarItems} from "~/utils/types";
import UserItem from "~/components/shared/user-item/user-item";

const sidebarItems: SidebarItems = {
    links: [
        { label: 'Home', href: '/', icon: Home },
        {
            href: '/local',
            icon: MapPin,
            label: 'Locais',
        },
        {
            href: '/tasks',
            icon: Bookmark,
            label: 'Tarefas',
        },
        {
            href: '/comunity',
            icon: Users,
            label: 'Comunidade',
        },
    ],
    extras: (
        <div className='flex flex-col gap-2'>
            <SidebarButton icon={MoreHorizontal} className='w-full'>
                Mais
            </SidebarButton>
            <SidebarButton
                className='w-full justify-center text-white'
                variant='default'
            >
                <span className="flex items-center"><Plus className="font-bold"/>Tarefa</span>
            </SidebarButton>
        </div>
    ),
};

export default function Sidebar(){
    return (
        <div className={` gap-4 flex flex-col w-[300px] min-w-[300px] border-r border-b min-h-screen p-4`}>
            <div><UserItem/></div>
            <div className="grow">
                <SidebarDesktop sidebarItems={sidebarItems} />
            </div>
        </div>
    );
}

