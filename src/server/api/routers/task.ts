import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import {Task} from "~/utils/types";
export const taskRouter = createTRPCRouter({

    createTask: protectedProcedure
        .input(z.object({
            title: z.string(),
            description: z.string().optional(),
            boardId: z.string(),
            responsibleId: z.string().optional().nullable(),
            estimatedDate: z.date().optional().nullable(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const newTask = await ctx.db.task.create({
                    data: {
                        title: input.title,
                        description: input.description,
                        boardId: input.boardId,
                        responsibleId: input.responsibleId,
                        creationDate: new Date(),
                        estimatedDate: input.estimatedDate,
                    },
                });
                return newTask;
            }catch (error) {
                throw new Error('Error creating task');
            }
        }),

    getTasks: protectedProcedure
        .input(z.object({
            boardId: z.string(),
            query: z.string().optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
            disabled: z.boolean().optional().default(false)
        }))
        .query(async ({input, ctx}) => {
            try{
                const where = {
                    boardId: input.boardId,
                    disabled: input.disabled
                };

                if (input.query) {
                    Object.assign(where, {
                        OR: [
                            {
                                title:{
                                    contains: input.query,
                                    mode: "insensitive"
                                }
                            },
                            {
                                responsible: {
                                    name: {
                                        contains: input.query,
                                        mode: "insensitive"
                                    }
                                }
                            }
                        ]
                    })
                }
                if(input.startDate && input.endDate){
                    Object.assign(where, {
                        AND: [
                            {
                                endDate: {
                                    gte: input.startDate
                                }
                            },
                            {
                                endDate: {
                                    lte: input.endDate
                                }
                            }
                        ]
                    })
                }

                const responseTask = await ctx.db.task.findMany({
                    where: where,
                    include:{
                       responsible: true
                    }
                });
                return responseTask as Task[];
            }catch (e) {
                throw new Error('Error getting tasks');
            }
        }),

    updateTask: protectedProcedure
        .input(z.object({
            taskId: z.string(),
            title: z.string(),
            description: z.string().optional(),
            responsibleId: z.string().optional().nullable(),
            estimatedDate: z.date().optional().nullable(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const responseTask = await ctx.db.task.update({
                    where: {
                        id: input.taskId,
                    },
                    data: {
                        title: input.title,
                        description: input.description,
                        responsibleId: input.responsibleId,
                        estimatedDate: input.estimatedDate,
                    },
                });
                return responseTask;
            }catch (e) {
                throw new Error('Error updating task');
            }
        }),

    deleteTask: protectedProcedure
        .input(z.object({
            taskId: z.string(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const responseTask = await ctx.db.task.delete({
                    where: {
                        id: input.taskId,
                    },
                });
                return responseTask;
            }catch (e) {
                throw new Error('Error deleting task');
            }
        }),

    disableTask: protectedProcedure
        .input(z.object({
            taskId: z.string(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const responseTask = await ctx.db.task.update({
                    where: {
                        id: input.taskId,
                    },
                    data: {
                        disabled: true,
                        status: "DONE",
                        endDate: new Date(),
                    },
                });
                return responseTask;
            }catch (e) {
                throw new Error('Error disabling task');
            }
        }),

    getUserTasks: protectedProcedure
        .query(async ({ ctx}) => {
            try{
                const responseTask = await ctx.db.task.findMany({
                    where: {
                        responsibleId: ctx.session.user.id,
                        disabled: false
                    },
                    include:{
                        responsible: true,
                        board: true
                    }
                });
                return responseTask as Task[];
            }catch (e) {
                throw new Error('Error getting user tasks');
            }
        }),

    handleTaskStatus: protectedProcedure
        .input(z.object({
            id: z.string(),
            status: z.string(),
        }))
        .mutation(async ({input, ctx}) => {
            try{
                const responseTask = await ctx.db.task.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        status: input.status,
                    },
                });
                return responseTask as Task;
            }catch (e) {
                throw new Error('Error updating task status');
            }
        }),
});
