import {getCsrfToken, signIn, signOut, useSession} from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {FaDiscord} from "react-icons/fa";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "~/components/ui/carousel";

export default function AuthHandler({children}: any, {csrfToken}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const session = useSession();
    const router = useRouter();
    const [shouldLogout, setShouldLogout] = useState(false);
    const [counter, setCounter] = useState(5);

    //removido para o login discord ser direcionado pela pagina de login da aplicação
    // useEffect(() => {
    //     if (session.status === 'unauthenticated') {
    //         const handleSignIn = async () => {
    //             try {
    //                 const response = await signIn("discord");
    //                 if (response?.ok) {
    //                     void router.push("/home");
    //                 }
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         };
    //
    //         void handleSignIn();
    //     }
    // }, [session, router]);

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
    return (
        SignInPage()
    );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}



export function SignInPage(){
    return (
        <main className="h-screen flex w-full">
            <div className="bg-primary-foreground w-full h-full flex p-16 items-center justify-center">
                <Carousel className="w-full max-w-xl">
                    <CarouselContent>
                        <CarouselItem>
                            <div className="flex aspect-square rounded p-8">
                                <img src="/assets/amico.svg" alt="Imagem Amico" className="w-full h-full" />
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="flex aspect-square rounded p-8">
                                <img src="/assets/bro.svg" alt="Imagem Amico" className="w-full h-full" />
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
            <section className="flex items-center justify-center bg-background h-full max-w-3xl w-full p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tighter flex items-center">
                            <span className="mr-3">Task Manager</span>
                        </CardTitle>
                        <CardDescription>
                            Utilize a sua conta do Discord para entrar na aplicação.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="mt-1 w-full" onClick={() => signIn('discord')}>
                           <FaDiscord className="mr-2"/> Entrar com Discord
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-muted-foreground text-center text-sm">Ao entrar na nossa plataforma você concorda com os nossos Termos de Uso e Política de Privacidade</p>
                    </CardFooter>
                </Card>
            </section>
        </main>
    );
}