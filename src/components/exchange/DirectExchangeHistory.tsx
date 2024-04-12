import { useState, useContext } from "react";
import { DirectExchangeStatus, ClassExchange } from "../../@types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MoonLoader } from "react-spinners";
import { DirectExchangeStatusCard } from "./DirectExchangeStatusCard"
import { SessionContext } from "../../contexts/SessionContext";
import { useExchangeHistory } from "../../api/hooks/useExchangeHistory";

export const DirectExchangeHistoryButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const {
        data: exchanges,
        isLoading: isLoadingHistory,
        isValidating: isValidatingHistory
    } = useExchangeHistory(loggedIn);

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
                                exchanges.filter((exchange) => exchange.status === "pending").map((exchange) => (
                                    <DirectExchangeStatusCard key={exchange.id} exchange={exchange} />
                                ))
                            }</div>
                        </TabsContent>
                        <TabsContent className="" value="accepted">
                            <div className="flex flex-col space-y-2"> {
                                exchanges.filter((exchange) => exchange.status === "accepted").map((exchange) => (
                                    <DirectExchangeStatusCard key={exchange.id} exchange={exchange} />
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
