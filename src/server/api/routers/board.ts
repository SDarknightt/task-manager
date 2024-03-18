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
                throw new Error('Error creating board');
            }
        }),

    getBoards: protectedProcedure
        .query(({ctx}) => {
            try{
                return ctx.db.board.findMany({
                    where: {
                        users: {
                            some: {
                                userId: ctx.session.user.id,
                            },
                        },
                    },
                });
            }catch (e) {
                throw new Error('Error getting boards');
            }
        }),

    updateBoard: protectedProcedure
        .input(z.object({
            id: z.string(),
            title: z.string().optional(),
            description: z.string().optional(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const updatedBoard = await ctx.db.board.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        title: input.title,
                        description: input.description,
                    },
                });
                return updatedBoard;
            }catch (error) {
                throw new Error('Error updating board');
            }
        }),
});