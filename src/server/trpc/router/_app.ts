import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { commentRouter } from "./comment";
import { userRouter } from "./user";
import { tagRouter } from "./tag";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  comment: commentRouter,
  user: userRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
