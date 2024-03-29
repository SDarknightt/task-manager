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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
      <SessionProvider session={session}>
          <ThemeProvider attribute="class"
                         defaultTheme="system"
                         enableSystem
          >
              <AuthHandler>
                  <Head>
                      <title>Task Manager</title>
                  </Head>
                  <main className="main-container">
                      <HeaderComponent/>
                      <div className="flex flex-1">
                          <Sidebar/>
                          <div className="content-container bg-background text-foreground w-full">
                              <Component { ...pageProps}/>
                              <Toaster/>
                          </div>
                      </div>
                      <Footer/>
                  </main>
              </AuthHandler>
          </ThemeProvider>
      </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
