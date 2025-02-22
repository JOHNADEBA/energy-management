import { useState } from "react";
import { ErrorDetail, ErrorResponse } from "../types";

export const useErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: { response?: ErrorResponse }) => {
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        const errorMessages = error.response.data.detail
          .map((err: ErrorDetail) => {
            if (
              err.loc &&
              (err.loc[1] === "first_name" || err.loc[1] === "last_name")
            ) {
              return `${capitalizeFirstLetter(err.loc[1])} ${removeFirstWord(
                err.msg
              )}`;
            }
            return err.msg || err.message;
          })
          .join(", ");
        setError(errorMessages);
      } else {
        setError(error.response.data.detail || "An unexpected error occurred.");
      }
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace("_", " ");
  };

  const removeFirstWord = (message: string) => {
    const words = message.split(" ");
    words.shift(); // Remove the first word
    return words.join(" ");
  };

  return { error, setError, handleError };
};
