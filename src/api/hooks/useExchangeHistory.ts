import useSWR from "swr";
import { getStudentHistory, logout } from "../backend";

export function useExchangeHistory(setLoggedIn) {
    const studentHistory = async (a_user) => {
        try {
            const res = await getStudentHistory();

            if (res.status !== undefined) {
                if (res.status === 403) {
                    await logout();
                    setLoggedIn(false);
                }
                return [];
            }

            return res;
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR("data", studentHistory, {
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
