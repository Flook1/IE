import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/* -------------------------------------------------------------------------- */
// Create a new ratelimiter, that allows 10 requests per 10 seconds

const rateLimit = async (id: string) => {
  const init = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "10 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit",
  });

  // need to put id below, for now we just using hardcoded value
  const limitOkay = await init.limit(id);

  if (!limitOkay.success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requestions, pleas wait",
    });
  }

  return limitOkay.success;
};

export default rateLimit;
