import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { MoonLoader } from "react-spinners";
import { verifyDirectExchange } from "../../../api/backend";
import { useDirectExchangeVerification } from "../../../api/useDirectExchangeVerification";

export const DirectExchangeVerification = () => {
    const { jwt } = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [verifiedResponse, setVerifiedResponse] = useState({ "verified": false });

    useEffect(() => {
        const directExchangeVerification = async (token) => {
            try {
                const res = await verifyDirectExchange(token);
                if (res.status === 403) {
                    const json = await res.json();

                    setVerifiedResponse(json);
                    setIsLoading(false);
                    return json;
                } else {
                    setVerifiedResponse(res);
                    setIsLoading(false);
                    return res;
                }
            } catch (error) {
                console.error(error);
            }
        }

        directExchangeVerification(jwt);
    }, [jwt]);

    return <>
        <MoonLoader className="mx-auto" loading={isLoading} />
        {!isLoading && verifiedResponse.verified ? <p>Successfully verified</p> : <p>Go home</p>}
    </>
}
