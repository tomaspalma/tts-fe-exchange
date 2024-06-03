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

            return res;
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR("data", fetchMarketplaceExchanges, {});

    return {
        data,
        error,
        isLoading,
        isValidating
    };
}
