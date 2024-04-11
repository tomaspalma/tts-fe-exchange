import { useState, useContext } from "react";
import { DirectExchangeStatus } from "../../@types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DirectExchangeStatusCard } from "./DirectExchangeStatusCard"
import { SessionContext } from "../../contexts/SessionContext";
import { useExchangeHistory } from "../../api/hooks/useExchangeHistory";

const test : DirectExchangeStatus[] = [
    {
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

export const DirectExchangeHistoryButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const username = localStorage.getItem("username");
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const {
        data: history,
        isLoading: isLoadingHistory,
        isValidating: isValidatingHistory
    } = useExchangeHistory(username, loggedIn);

    console.log(history);

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
                <Tabs defaultValue="pending" className="w-full overflow-scroll">
                    <TabsList className="grid w-full grid-cols-2 border border-black">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="accepted">Aceites</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                        <div className="flex flex-col space-y-2"> {
                            test.filter((test_1) => test_1.status === "pending").map((test_1) => (
                                <DirectExchangeStatusCard exchange={test_1}/>
                            ))
                        }</div>
                    </TabsContent>
                    <TabsContent className="" value="accepted">
                        <div className="flex flex-col space-y-2"> {
                            test.filter((test_1) => test_1.status === "accepted").map((test_1) => (
                                <DirectExchangeStatusCard exchange={test_1}/>
                            ))
                        }</div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    </>
}
