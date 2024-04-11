import useSWR from "swr";
import { getStudentHistory, logout } from "../backend";

export function useExchangeHistory(username, setLoggedIn) {
    const studentHistory = async (username: string) => {
        try {
            const res = await getStudentHistory(username);

            if (!res.ok) {
                if (res.status === 403) {
                    await logout();
                    setLoggedIn(false);
                }
            }

            return res;
        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR(username, studentHistory, {
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
