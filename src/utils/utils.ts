export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

export const buttonLabels = [
  {
    submitting: "Creating...",
    submit: "Create",
    id: "create",
  },
  {
    submitting: "Saving...",
    submit: "Save",
    id: "edit",
  },
];
