interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      'validation-errors'?: ValidationError[];
    };
  };
}

interface NormalizedError {
  message: string;
  errors?: Record<string, [string]>;
}

export const normalizeError = (error: ErrorResponse): NormalizedError => {
  const message = error.response?.data?.message || 'Unknown error';
  const validationErrors = error.response?.data?.['validation-errors'];
  if (validationErrors != null && validationErrors?.length > 0) {
    const errors = validationErrors.reduce((acc, error: ValidationError) => {
      acc[error.field] = [error.message];
      return acc;
    }, {} as Record<string, [string]>);

    return { message, errors };
  }

  return { message };
};
