import { useState, useContext } from "react";
import { DirectExchangeStatus, ClassExchange } from "../../@types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MoonLoader } from "react-spinners";
import { DirectExchangeStatusCard } from "./DirectExchangeStatusCard"
import { SessionContext } from "../../contexts/SessionContext";
import { useExchangeHistory } from "../../api/hooks/useExchangeHistory";

const test: DirectExchangeStatus[] = [
    {
        id: 1,
        class_exchanges: [
            {
                course_unit: "IA",
                old_class: "LEIC01",
                new_class: "LEIC02",
                other_student: "202100000"
            },
            {
                course_unit: "CPD",
                old_class: "LEIC01",
                new_class: "LEIC02",
                other_student: "202100000"
            }
        ],
        status: "pending"
    },
    {
        id: 2,
        class_exchanges: [
            {
                course_unit: "IA",
                old_class: "LEIC01",
                new_class: "LEIC02",
                other_student: "202100000"
            },
            {
                course_unit: "CPD",
                old_class: "LEIC01",
                new_class: "LEIC02",
                other_student: "202100000"
            }
        ],
        status: "accepted"
    }];

function directExchangeFromAPI(history: string) : DirectExchangeStatus[]  {
    let obj = JSON.parse(history).map((obj) => obj["fields"]);
    let exchanges_map = new Map();
    let exchanges : DirectExchangeStatus[] = [];

    for(let exchangeParticipation of obj) {
        let id = exchangeParticipation["direct_exchange"];
        let exchange : ClassExchange = {
            course_unit: exchangeParticipation["course_unit"],
            old_class: exchangeParticipation["old_class"],
            new_class: exchangeParticipation["new_class"],
            other_student: "unknown"
        };

        if(exchanges_map.get(id)) {
            exchanges_map.get(id)["class_exchanges"].push(exchange);
        } else {
            exchanges_map.set(
                id,
                {
                    id: id,
                    class_exchanges: [exchange],
                    status: "pending"
                }
            )
        }

    }

    for(let value of exchanges_map.values()) {
        exchanges.push(
            {
                id: value.id,
                class_exchanges: value.class_exchanges,
                status: value.status
            }
        )
    }

    return exchanges;
}

export const DirectExchangeHistoryButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const {
        data: history,
        isLoading: isLoadingHistory,
        isValidating: isValidatingHistory
    } = useExchangeHistory(loggedIn);

    let exchanges : DirectExchangeStatus[] = [];
    if(!isLoadingHistory) {
        exchanges = directExchangeFromAPI(history);
        console.log(exchanges);
    }

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="submit"
                    className="w-full"
                >
                    Ver histórico
                </Button>
            </DialogTrigger>
            <DialogContent className="h-5/6 content-start">
                <DialogHeader className="">
                    <DialogTitle className="text-center">Confirmação de sumbissão de troca direta</DialogTitle>
                    <DialogDescription className="text-center">
                        Após a submissão, tanto tu como o estudante com o qual especificaste na troca terão de clicar num link de confirmação para que a
                        troca se efetue de facto.
                    </DialogDescription>
                </DialogHeader>
                {!isLoadingHistory ? 

                    <Tabs defaultValue="pending" className="w-full overflow-scroll">
                        <TabsList className="grid w-full grid-cols-2 border border-black">
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="accepted">Aceites</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending">
                            <div className="flex flex-col space-y-2"> {
                                exchanges.filter((test_1) => test_1.status === "pending").map((test_1) => (
                                    <DirectExchangeStatusCard exchange={test_1} />
                                ))
                            }</div>
                        </TabsContent>
                        <TabsContent className="" value="accepted">
                            <div className="flex flex-col space-y-2"> {
                                exchanges.filter((test_1) => test_1.status === "accepted").map((test_1) => (
                                    <DirectExchangeStatusCard exchange={test_1} />
                                ))
                            }</div>
                        </TabsContent>
                    </Tabs> : <div className="mt-4">
                        <MoonLoader className="mx-auto my-auto" loading={isLoadingHistory} />
                        <p className="text-center">A carregar os horários</p>
                    </div>
                }
            </DialogContent>
        </Dialog>
    </>
}
