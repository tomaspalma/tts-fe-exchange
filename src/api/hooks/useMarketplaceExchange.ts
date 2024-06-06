import useSWR from "swr";
import { getMarketPlaceExchanges, logout } from "../backend";

export function useMarketplaceExchange(setLoggedIn) {
    const fetchMarketplaceExchanges = async () => {
        try {
            const res = await getMarketPlaceExchanges();


            if (res.status === 403) {
                await logout();
                setLoggedIn(false);
            }

            console.log("RESPONSE IS: ", res);
            return res;
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR("data", fetchMarketplaceExchanges);

    console.log("DATA IS: ", data);

    return {
        data,
        error,
        isLoading,
        isValidating
    };
}
