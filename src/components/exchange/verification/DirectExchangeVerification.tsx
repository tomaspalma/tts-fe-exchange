import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
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

    return <div>
        <MoonLoader className="mx-auto" loading={isLoading} />
        {!isLoading && verifiedResponse.verified
            ? <div className="flex flex-col items-center">
                <CheckCircleIcon className="h-20 w-20 text-green-700" />
                <p className="text-2xl">Verificado com sucesso</p>
            </div>
            :
            <div className="flex flex-col items-center">
                <InformationCircleIcon className="h-20 w-20 text-blue-400"></InformationCircleIcon>
                <p className="text-2xl">A troca já foi confirmada ou não foi possível confirmar</p>
            </div>
        }
    </div>
}
