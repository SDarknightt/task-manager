import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import AuthHandler from "~/pages/login";
import HeaderComponent from "~/components/shared/header/header";
import {ThemeProvider} from "~/components/theme-provider";
import Sidebar from "~/components/shared/sidebar/sidebar";
import {Toaster} from "~/components/ui/toaster";
import Footer from "~/components/shared/footer/footer";
import {useState} from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class"
                defaultTheme="light"
                enableSystem
            >
                <AuthHandler>
                    <Head>
                        <title>Task Manager</title>
                    </Head>
                    <main className="flex flex-col min-h-screen bg-gray-300">
                        <HeaderComponent isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                        <body className="flex flex-row justify-center flex-grow">
                            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                            <div className="content-container bg-background text-foreground w-full sm:max-w-[80%]">
                                <Component {...pageProps}/>
                                <Toaster/>
                            </div>
                        </body>
                        <Footer/>
                    </main>
                </AuthHandler>
            </ThemeProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);