import { useState, useEffect } from "react";

export const useEventsSearch = (url: string, pageNumber: number) => {
  const [data, setData] = useState<Array<any> | any>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    setData([]);
  }, [url]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        console.log("fetching");
        setIsPending(true);
        setError(null);
        const response = await fetch(url + pageNumber, {
          credentials: "include",
          signal,
        });
        if (!response.ok) {
          throw Error("could not fetch that resource");
        }
        try {
          const respjson = await response.json();
          const eventlist :Event[] = respjson.events;
          setIsPending(false);
          
          setData((prevdata: any) => {
            return [...new Set([...prevdata, ...eventlist])];
          });
          setHasMore(eventlist.length > 0)

          setError(null);
        } catch (error: any) {
          setIsPending(false);
          setError(error);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        }
        setIsPending(false);
        setError(error);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, pageNumber]);

  return { data, isPending, error, hasMore };
};
