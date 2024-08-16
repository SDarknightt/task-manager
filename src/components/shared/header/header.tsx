import {Moon, PanelLeftClose, PanelLeftOpen, Sun} from "lucide-react";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import { Menubar } from "~/components/ui/menubar";
import Image from "next/image";

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [filter, setFilter]  = useState('none')

    useEffect(() => {
        theme === 'light' ? setFilter(() => 'invert(95%)') : setFilter(() => '')
    }, [theme, filter])

    return (
        <Menubar className="menu-header rounded-none px-2 border-l-0 border-r-0 border-t-0 border-b  lg:px-4 p-8">
            <div className="flex justify-start">
                <div className="flex flex-row self-center ml-2">
                        <Image
                            src="/assets/logo.svg"
                            width={80}
                            height={0}
                            style={{filter: filter}}
                            alt="Logo KanPlan"
                            className="ml-3"
                        />
                    </div>
            </div>
            <div className="flex justify-end align-end">
                <button onClick={toggleSidebar} className="p-2 top-4 left-4 z-50">
                    {isSidebarOpen ? (
                        <PanelLeftClose className="transition-transform duration-300 transform rotate-180"/>
                    ) : (
                        <PanelLeftOpen className="transition-transform duration-300 transform rotate-0"/>
                    )}
                </button>
                <button className="flex items-center pl-2"
                        onClick={(): void => setTheme(theme === 'dark' ? 'light' : 'dark')} suppressHydrationWarning>
                    {theme == "dark" ? (
                        <Moon className="transition-transform duration-300 transform rotate-180"/>
                    ) : (
                        <Sun className="transition-transform duration-300 transform rotate-0"/>
                    )}
                </button>
            </div>
        </Menubar>
    );
}