import "server-only";

import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiFailure(message: string, status: number, code: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details === undefined ? {} : { details }) } },
    { status },
  );
}
