interface ApiErrorOptions {
  status?: number;
  code?: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  fields?: Record<string, string>;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);

    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.fields = options.fields;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  hasFields(): this is ApiError & { fields: Record<string, string> } {
    return this.fields !== undefined && Object.keys(this.fields).length > 0;
  }
}
