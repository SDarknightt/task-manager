import {z} from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import {generateNumericShareId} from "~/utils/utilities";

export const userRouter = createTRPCRouter({
    generateShareId: protectedProcedure
        .input(z.object({}))
        .mutation(async ({ ctx}) => {
            try{
                const shareId = generateNumericShareId();
                if(shareId) {
                    const updateShareId = await ctx.db.user.update({where: {id: ctx.session.user.id}, data: {shareId: shareId}});
                    if(updateShareId) {
                        return shareId;
                    }
                }
            }catch (error) {
                throw new Error('Error generating share id');
            }
        }),

    getUsersBoard: protectedProcedure
        .input(z.object({boardId: z.string()}))
        .query(async ({input, ctx}) => {
            try{
                const users = await ctx.db.user.findMany({
                    where: {
                        boards: {
                            some: {
                                boardId: input.boardId
                            }
                        }
                    },
                });
                return users;
            }catch (error) {
                throw new Error('Error getting users');
            }
        }),

    removeUserBoard: protectedProcedure
        .input(z.object({boardId: z.string(), userId: z.string()}))
        .mutation(async ({input, ctx}) => {
            try{
                const isAdmin = await ctx.db.userBoard.findUnique({
                    where: {
                        userId_boardId: {
                            userId: ctx.session.user.id,
                            boardId: input.boardId
                        }
                    },
                    select: {
                        admin: true
                    }
                });

                if(!isAdmin || !isAdmin.admin) {
                    throw new Error('User is not admin');
                }

                //first change tasks to null
               const tasksToNull = await ctx.db.task.updateMany({
                    where: {
                        boardId: input.boardId,
                        responsibleId: input.userId
                    },
                    data: {
                        responsibleId: null
                    }
                });
               if(tasksToNull) {
                   const removedUserBoard = await ctx.db.userBoard.delete({
                       where: {
                           userId_boardId: {
                               userId: input.userId,
                               boardId: input.boardId
                           }
                       }
                   });

                   if(removedUserBoard) {
                       return removedUserBoard;
                   }
               }
            } catch (e) {
                throw new Error('Error removing user from board');
            }
        }),
});