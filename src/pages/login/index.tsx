import {getCsrfToken, signIn, signOut, useSession} from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {useEffect, useState} from "react";
import { useRouter } from "next/router";

export default function AuthHandler({children}: any, {csrfToken}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const session = useSession();
    const router = useRouter();
    const [shouldLogout, setShouldLogout] = useState(false);
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            const handleSignIn = async () => {
                try {
                    const response = await signIn("discord");
                    if (response?.ok) {
                        void router.push("/home");
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            void handleSignIn();
        }
    }, [session, router]);

    useEffect(() => {
        if (session.status === 'authenticated') {
            const intervalId = setInterval(() => {
                setCounter(prevCounter => prevCounter - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [session]);

    useEffect(() => {
        if (counter === 0) {
            setShouldLogout(true);
        }
    }, [counter]);

    if (session.status === 'authenticated') {
            return children;
    }

    if (session.status === 'loading') {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col items-center">
                    <p className="text-foreground text-lg font-semibold">Carregando...</p>
                </div>
            </div>
        );
    }

    return null;
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}