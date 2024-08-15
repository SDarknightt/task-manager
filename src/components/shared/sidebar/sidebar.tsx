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
    const touchStartX = useRef<number | null>(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsSidebarOpen(false);
        }
    };

    const handleTouchStart = (event: TouchEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent) => {
        if (touchStartX.current !== null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const touchEndX = event.touches[0].clientX;
            if (touchStartX.current < 50 && touchEndX - touchStartX.current > 50) {
                setIsSidebarOpen(true);
                touchStartX.current = null;
            }
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

    useEffect(() => {
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <div className="relative min-h-screen">
            <button onClick={toggleSidebar} className="p-2 top-4 left-4 z-50 sm:block hidden">
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