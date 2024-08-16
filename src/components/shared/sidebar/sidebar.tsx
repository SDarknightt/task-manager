import { useEffect, useRef } from "react";
import { SidebarDesktop } from "./sidebar-desktop";
import { SidebarItems } from "~/utils/types";
import UserItem from "~/components/shared/user-item/user-item";
import { Bookmark, MapPin, Home } from "lucide-react";
import { useRouter } from "next/router";

const sidebarItems: SidebarItems = {
    links: [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/boards', icon: MapPin, label: 'Quadros' },
        { href: '/tasks', icon: Bookmark, label: 'Minhas Tarefas' },
    ],
};

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            toggleSidebar();
        }
    };

    const handleLinkClick = (href: string) => {
        toggleSidebar();
        void router.push(href);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);
        } else {
            document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
        };
    }, [isSidebarOpen]);

    return (
        <div className="relative min-h-screen">
            {isSidebarOpen && (
                <div ref={sidebarRef} className="absolute top-0 left-0 w-[300px] min-w-[300px] h-full border-r p-4 bg-background z-40">
                    <div><UserItem /></div>
                    <div className="grow">
                        <SidebarDesktop sidebarItems={sidebarItems} onLinkClick={handleLinkClick} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;