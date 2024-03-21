import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import {boardRouter} from "~/server/api/routers/board";
import {userRouter} from "~/server/api/routers/user";
import {taskRouter} from "~/server/api/routers/task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  board: boardRouter,
  user: userRouter,
  task: taskRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
