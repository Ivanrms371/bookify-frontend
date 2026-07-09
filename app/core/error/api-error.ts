export class ApiError extends Error {
  status?: number;
  code?: string;
  fields?: Record<string, string>;

  constructor(message: string, status?: number, code?: string, fields?: Record<string, string>) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
