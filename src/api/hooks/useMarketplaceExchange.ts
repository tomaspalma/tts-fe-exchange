import useSWR from "swr";
import { getMarketPlaceExchanges, logout } from "../backend";
import { SessionContext } from "../../contexts/SessionContext";
import { useContext } from "react";
/*
export function useMarketplaceExchanges() {
    const { loggedIn, setLoggedIn } = useContext(SessionContext);

    const fetcher = async () => {
        try {
            const res = await getMarketPlaceExchanges();

            if (!res.ok) {
                if (res.status === 403) {
                    await logout();
                    setLoggedIn(false);
                }
            }

            const data = await res.json();

            const mappedData = data.map(exchange => ({
                studentName: exchange.issuer,
                exchanges: [{
                    course: exchange.course_unit,
                    from: exchange.old_class,
                    to: exchange.new_class
                }]
            }));

            return mappedData;
        } catch (error) {
            return error;
        }
    };

    const { data, error, isValidating } = useSWR("marketplaceExchanges", fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    return {
        data,
        error,
        isValidating
    };
}
*/