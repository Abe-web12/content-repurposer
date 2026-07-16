import "reflect-metadata"
import { z, ZodSchema } from "zod"
import { plainToInstance } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import type { ClassConstructor } from "class-transformer"

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> }

export function validateBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): ValidationResult<T> {
  const result = schema.safeParse(body)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string[]> = {}

  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "_root"
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  }

  return { success: false, errors }
}

function flattenClassErrors(
  validationErrors: ValidationError[],
  parentPath = ""
): Record<string, string[]> {
  const errors: Record<string, string[]> = {}

  for (const error of validationErrors) {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property

    if (error.constraints) {
      const messages = Object.values(error.constraints)
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(...messages)
    }

    if (error.children && error.children.length > 0) {
      const childErrors = flattenClassErrors(error.children, path)
      for (const [key, msgs] of Object.entries(childErrors)) {
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key].push(...msgs)
      }
    }
  }

  return errors
}

export async function validateDTO<T extends object>(
  cls: ClassConstructor<T>,
  plain: unknown
): Promise<ValidationResult<T>> {
  const instance = plainToInstance(cls, plain)
  const validationErrors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  })

  if (validationErrors.length === 0) {
    return { success: true, data: instance }
  }

  return { success: false, errors: flattenClassErrors(validationErrors) }
}
