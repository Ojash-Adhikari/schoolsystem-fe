import { useEffect, useRef } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import axios from "./axios";

const usedEndpoints = new Set(); 

const useAxiosAuth = () => {
  const authHeader = useAuthHeader();
  const interceptorRef = useRef(null);

  useEffect(() => {
    interceptorRef.current = axios.interceptors.request.use(
      (config) => {
        // Inject Authorization header if missing
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = authHeader;
        }

        // Track API usage
        if (config.url) {
          const fullEndpoint = `${config.method?.toUpperCase() || "GET"} ${config.url}`;
          usedEndpoints.add(fullEndpoint);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptorRef.current);
    };
  }, [authHeader]);

  return axios;
};

export default useAxiosAuth;
