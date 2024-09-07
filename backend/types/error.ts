export interface CastError extends Error {
  path: string;
  value: string;
}

export interface DuplicateError extends Error {
  code: number;
  errmsg: string;
}

export interface ValidationError extends Error {
  errors: Record<string, { message: string }>;
}
