import useSWR from "swr";
import { getIsAdmin } from "../backend";

export function useIsAdmin(username) {
    const isAdmin = async (username : string) => {
        try {
            const res = await getIsAdmin(username);
            
            if(res.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR(username, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    return {
        data,
        error,
        isLoading,
        isValidating
    };
}
