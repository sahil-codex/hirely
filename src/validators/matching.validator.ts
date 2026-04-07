import { z } from "zod";

export const matchQuerySchema = z.object({
    jobId:z.string().uuid("Invalid Job ID"),
});