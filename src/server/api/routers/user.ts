import { z } from "zod";

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
});