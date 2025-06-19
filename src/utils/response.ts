/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Safely extracts data from API response
 * @param response - The API response
 * @returns The data from the response
 */
export const getResponseData = <T>(response: any): T => {
  return response?.data?.data;
};
export const getErrorResponse = (error: unknown): Error => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response: { data: { message: string } } })
      .response;
    return new Error(response?.data?.message || "An unknown error occurred");
  }
  return new Error("An unknown error occurred");
};
