import useSWR from "swr";
import { getIsAdmin } from "../backend";

export function useIsAdmin(username) {
    const isAdmin = async (username : string) => {
        try {
            const res = await getIsAdmin();
            console.log("dsklfjewkljf3wiojd");
            
            if(res.ok) {
                return res["admin"];
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR(username, isAdmin, {
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
