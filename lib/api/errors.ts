export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message)
    this.name = "UnauthorizedError"
  }
}

export class ValidationError extends ApiError {
  public fields: { loc: string[]; msg: string; type: string }[]

  constructor(
    message: string,
    fields: { loc: string[]; msg: string; type: string }[],
  ) {
    super(422, message)
    this.name = "ValidationError"
    this.fields = fields
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource has been modified. Please refresh and try again.") {
    super(409, message)
    this.name = "ConflictError"
  }
}
