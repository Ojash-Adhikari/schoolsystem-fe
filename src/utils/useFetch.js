import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "./useAxiosAuth";

const useFetch = (url) => {
  const axios = useAxiosAuth();
  const [data, setData] = useState([]);

  // Fetching data function
  const fetchData = useCallback(() => {
    if (url) {
      axios
        .get(`/api/${url}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error.response || error.message);
        });
    }
  }, [url, axios]);

  // Fetch data on component mount or when URL changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return data and the refetch function
  return { data, refetch: fetchData };
};

export default useFetch;
