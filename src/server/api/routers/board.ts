import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import {Board} from "~/utils/types";

export const boardRouter = createTRPCRouter({
    createBoard: protectedProcedure
        .input(z.object({
            title: z.string(),
            description: z.string().optional(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const newBoard = await ctx.db.board.create({
                    data: {
                        title: input.title,
                        description: input.description,
                        users: {
                            create: {
                                userId: ctx.session.user.id,
                                admin: true,
                            },
                        },
                    },
                }) as Board;
                return newBoard;
            }catch (error) {
                console.error(error);
            }
        })
});
