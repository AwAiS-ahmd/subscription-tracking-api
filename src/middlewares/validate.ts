import type { Request, Response, NextFunction } from "express";
import { type ZodTypeAny } from "zod";

type RequestTarget = "body" | "params" | "query";

/**
 * Validate middleware factory.
 *
 * Usage:
 *   router.post("/", validate(signUpSchema), controller)
 *   router.patch("/:id", validate(updateSchema, "body"), controller)
 *   router.get("/:id", validate(idSchema, "params"), controller)
 */
export const validate =
    (schema: ZodTypeAny, target: RequestTarget = "body") =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse(req[target]);

            if (!result.success) {
                return next(result.error);
            }

            // Assign parsed (and coerced) data back so controllers receive clean values
            (req as unknown as Record<string, unknown>)[target] = result.data;
            return next();
        };