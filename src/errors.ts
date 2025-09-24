export class QueryStringDriverError extends Error {
  public readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'QueryStringDriverError'
    this.cause = cause
  }
}