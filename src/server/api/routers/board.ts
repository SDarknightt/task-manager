import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import {Board, User} from "~/utils/types";

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
        .query(async ({ctx}) => {
            try{
                const responseBoard = await ctx.db.board.findMany({
                    where: {
                        users: {
                            some: {
                                userId: ctx.session.user.id,
                            },
                        },
                    },
                });
                return responseBoard as  Board[];
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
                return updatedBoard as Board;
            }catch (error) {
                throw new Error('Error updating board');
            }
        }),

    getBoardDetails: protectedProcedure
        .input(z.object({boardId: z.string()}))
        .query(async ({input, ctx}) => {
            try{
                const board = await ctx.db.board.findUnique({
                    where: {
                        id: input.boardId,
                    },
                });
                return board as Board;
            } catch (error) {
                throw new Error('Error getting board details');
            }
        }),

    addUserToBoard: protectedProcedure
        .input(z.object({boardId: z.string(), shareId: z.number()}))
        .mutation(async({ctx, input}) => {
            try{
                // Check if user exists
                const user = await ctx.db.user.findUnique({
                    where: {
                        shareId: input.shareId,
                    },
                });

                // Check if user is already on board
                const board = await ctx.db.board.findUnique({
                    where: {
                        id: input.boardId,
                    },
                    select: {
                        users: {
                            where: {
                                userId: user?.id,
                            },
                        },
                    },
                });

                if(board?.users.length === 0 && user) {
                    const response = await ctx.db.userBoard.create({
                        data: {
                            userId: user?.id,
                            boardId: input.boardId,
                        },
                    });
                    if(response) {
                        return user as User;
                    }
                }

            }catch (error) {
                throw new Error('Error adding user to board api.');
            }
        })
});