import useSWR, { Fetcher } from "swr"
import { getApiRoute, verifyDirectExchange } from "./backend"

export const useDirectExchangeVerification = (token) => {
    const directExchangeVerification: Fetcher<any, string> = async (token) => {
        try {
            const res = await verifyDirectExchange(token);
            if (res.status === 403) {
                const json = await res.json();
                console.log("json is: ", json);
                return json;
            } else {
                return res;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const { data, mutate, error, isLoading, isValidating } = useSWR(
        token,
        directExchangeVerification
    );

    return {
        isLoading,
        isValidating,
        data,
        mutate
    };
}
