import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import AuthHandler from "~/pages/login";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
      <SessionProvider session={session}>
          <AuthHandler csrfToken="">
            <Head>
                <title>Task Manager</title>
            </Head>
              <main className='main-container'>
                  <div className="content-container bg-background text-foreground">
                      <Component { ...pageProps}/>
                  </div>
              </main>
            </AuthHandler>
      </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
