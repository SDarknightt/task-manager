'use client';

import {
    Bookmark,
    Home,
    MapPin,
    PanelLeftOpen,
    PanelLeftClose
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from "~/utils/types";
import UserItem from "~/components/shared/user-item/user-item";
import { useState, useEffect, useRef } from "react";

const sidebarItems: SidebarItems = {
    links: [
        { label: 'Home', href: '/', icon: Home },
        {
            href: '/boards',
            icon: MapPin,
            label: 'Quadros',
        },
        {
            href: '/tasks',
            icon: Bookmark,
            label: 'Minhas Tarefas',
        },
    ],
};

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="relative min-h-screen">
            <button onClick={toggleSidebar} className="p-2 top-4 left-4 z-50">
                {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            </button>
            {isSidebarOpen && (
                <div ref={sidebarRef} className="absolute top-0 left-0 w-[300px] min-w-[300px] h-full border-r p-4 bg-white z-40">
                    <div><UserItem /></div>
                    <div className="grow">
                        <SidebarDesktop sidebarItems={sidebarItems} />
                    </div>
                </div>
            )}
        </div>
    );
}