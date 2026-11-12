import "server-only";

import { ZodError } from "zod";

import { ApiError } from "./api-error";
import { apiFailure } from "./api-response";

type RouteHandler<T extends unknown[]> = (...args: T) => Promise<Response>;

export function withErrorHandling<T extends unknown[]>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        return apiFailure(error.message, error.status, error.code, error.details);
      }

      if (error instanceof ZodError) {
        return apiFailure("Invalid request", 400, "VALIDATION_ERROR", error.flatten());
      }

      console.error("Unhandled route error", error);
      return apiFailure("Internal server error", 500, "INTERNAL_SERVER_ERROR");
    }
  };
}
