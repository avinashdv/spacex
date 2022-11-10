import { useState, useCallback } from "react";

export default function useHttp() {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(async (requestConfig, sendData) => {
    setIsLoading(true);
    try {
      await fetch(requestConfig.url, {
        method: requestConfig.method ? "POST" : "GET",
        body: JSON.stringify(requestConfig.body),
      })
        .then((response) => response.json())
        .then((data) => {
          sendData(data);
        });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    sendRequest,
  };
}
