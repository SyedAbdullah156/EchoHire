type ApiErrorBody = {
  message?: string;
  errors?: {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };
};

export const getApiErrorMessage = (body: ApiErrorBody | undefined, fallback: string) => {
  if (!body) return fallback;

  const fieldMessages = Object.values(body.errors?.fieldErrors ?? {}).flat().filter(Boolean);
  const formMessages = body.errors?.formErrors ?? [];
  const combined = [...formMessages, ...fieldMessages].filter(Boolean);

  if (combined.length > 0) {
    return combined.join(" ");
  }

  return body.message ?? fallback;
};
