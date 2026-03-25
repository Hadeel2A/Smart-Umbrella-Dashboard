import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { fetchDevicesFromDynamoDB, calculateDeviceStats, generateAlerts } from "./dynamodb";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Device data endpoints
  devices: router({
    /**
     * Get all devices from DynamoDB
     */
    getAll: publicProcedure.query(async () => {
      try {
        const devices = await fetchDevicesFromDynamoDB();
        return devices;
      } catch (error) {
        console.error("Error fetching devices:", error);
        throw new Error("Failed to fetch devices from DynamoDB");
      }
    }),

    /**
     * Get device statistics
     */
    getStats: publicProcedure.query(async () => {
      try {
        const stats = await calculateDeviceStats();
        return stats;
      } catch (error) {
        console.error("Error calculating stats:", error);
        throw new Error("Failed to calculate device statistics");
      }
    }),

    /**
     * Get system alerts
     */
    getAlerts: publicProcedure.query(async () => {
      try {
        const alerts = await generateAlerts();
        return alerts;
      } catch (error) {
        console.error("Error generating alerts:", error);
        throw new Error("Failed to generate alerts");
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
