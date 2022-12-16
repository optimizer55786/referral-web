import { getGlobal, getDispatch, useEffect, useState } from "reactn";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

const getTokenHeader = () => {
    const user = getGlobal().user;
    const token = getGlobal().token;
    const selectedAccount = getGlobal().selectedAccount;
    const selectedBusinessLineId = getGlobal().selectedBusinessLineId;

    if (!token) {
        return {};
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "X-RL-BUSINESS-LINE": selectedBusinessLineId,
    };

    if (
        selectedAccount &&
        selectedAccount.value &&
        selectedAccount.value !== user.account_id
    ) {
        headers["X-RL-ACCOUNT"] = selectedAccount.value;
    }

    return headers;
};

export const createUrl = (url, queryParams) => {
    const params = [];

    if (queryParams) {
        Object.keys(queryParams).forEach((key) => {
            if (queryParams[key]) {
                params.push(
                    `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
                );
            }
        });
    }

    return params.length > 0 ? `${url}?${params.join("&")}` : url;
};

export const makeRequest = async (useMethod, url, payload = null) => {
    try {
        const method = useMethod.toLowerCase();
        const config = {
            method,
            url: `${process.env.REACT_APP_API_URL}${url}`,
            headers: getTokenHeader(),
        };

        if (method !== "get" && payload) {
            config.data = payload;
        }

        const response = await axios(config);

        return response.data;
    } catch (err) {
        const logout = getDispatch().logout;

        if (err.response.status === 401 || err.response.status === 403) {
            logout();
        }

        if (err.response.data && err.response.data.msg) {
            throw new Error(err.response.data.msg);
        }
        throw new Error(
            "Unknown error encountered. Please refresh the page and try again."
        );
    }
};

export const useApiGet = (
    cacheName,
    url,
    queryParams = undefined,
    params = {}
) => {
    return useQuery(
        [cacheName, url, queryParams],
        async () => {
            const response = await makeRequest("get", createUrl(url, queryParams));
            return response;
        },
        {
            refetchOnWindowFocus: false,
            staleTime: 300000,
            ...params,
        }
    );
};

export const useApiGetResource = (
    baseUrl,
    resourceId,
    queryParams = undefined,
    params = {}
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!resourceId || resourceId === "new") {
            return false;
        }

        setIsLoading(true);
        setIsError(false);
        setError(null);
        setData(null);

        (async () => {
            try {
                const res = await makeRequest(
                    "get",
                    createUrl(`${baseUrl}/${resourceId}`, queryParams)
                );
                setData(res);
            } catch (err) {
                if (params.onError) {
                    params.onError(err);
                }
                setError(err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resourceId]);

    return { isLoading, data, isError, error };
};

export const useApiRequest = (callback, params = {}) => {
    return useMutation(
        async ({ url, queryParams = undefined, method, payload }) => {
            const response = await makeRequest(
                method,
                createUrl(url, queryParams),
                payload
            );
            if (typeof callback === "function") {
                callback(response);
            }
            return response;
        },
        params
    );
};

export const useApiPost = (url, callback, opts = {}) => {
    return useMutation(async (payload) => {
        const response = await makeRequest("post", url, payload);
        if (typeof callback === "function") {
            callback(response);
        }
        return response;
    }, opts);
};

export const useApiPut = (url, callback, opts = {}) => {
    return useMutation(async (payload) => {
        const response = await makeRequest("put", url, payload);
        if (typeof callback === "function") {
            callback(response);
        }
        return response;
    }, opts);
};

export const useApiWrite = (callback, opts = {}) => {
    return useMutation(async ({ url, method, payload }) => {
        const response = await makeRequest(method, url, payload);
        if (typeof callback === "function") {
            callback(response);
        }
        return response;
    }, opts);
};

export const useApiWriteDynamic = (method, callback, opts = {}) => {
    return useMutation(async (url, payload) => {
        const response = await makeRequest(method, url, payload);
        if (typeof callback === "function") {
            callback(response);
        }
        return response;
    }, opts);
};

export const useApiDelete = (callback, opts = {}) => {
    return useMutation(async (url) => {
        const response = await makeRequest("delete", url);
        if (typeof callback === "function") {
            callback(response);
        }
        return response;
    }, opts);
};
