import {string, z} from "zod";

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
               const removedUser = await ctx.db.user.update({
                     where: {id: input.userId},
                     data: {
                         boards: {
                             disconnect: {
                                 boardId: input.boardId,
                                 userId: input.userId
                             }
                         }
                     }
                });
               if(removedUser) {
                   return removedUser;
               }
           } catch (e) {
               throw new Error('Error removing user from board');
           }
        }),

    makeUserAdmin: protectedProcedure
        .input(z.object({userId: z.string(), boardId: z.string()}))
        .mutation(async ({input, ctx}) => {
           try{
               const newAdmin = await ctx.db.user.update({
                   where: {id: input.userId},
                   data: {
                       boards: {
                           update: {
                               where: {boardId: input.boardId, userId: input.userId},
                               data: {isAdmin: true}
                           }
                       }
                   }
               });
                if(newAdmin) {
                    return newAdmin;
                }
           } catch (e) {
               throw new Error("Error making user admin");
           }
        }),

});