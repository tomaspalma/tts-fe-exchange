import { ArrowRightIcon } from "lucide-react";
import { DirectExchangeStatus } from "../../@types";

type Props = {
    exchange: DirectExchangeStatus
}

export const DirectExchangeStatusCard = ({
    exchange
}: Props) => {

    const username = localStorage.getItem("username");
    const class_exchanges = exchange.class_exchanges;
    const text_color = exchange.status === "pending" ? "text-orange-500" : "text-green-400";
    const text = exchange.status === "pending" ? "Pendente" : "Aceite";
    const received = exchange.issuer === username ? "Enviado" : "Recebido (" + exchange.issuer + ")";
    console.log(exchange)

    return <div className="flex flex-col w-full space-y-2 justify-around rounded-md border p-4 shadow-md">
        <div className="flex justify-between">
            <span className={text_color}>{text}</span>
            <span>{received}</span>
        </div>
        {
            class_exchanges.map((class_exchange) => (
                <div className={"flex justify-around p-2 space-x-4 border rounded-md " + (class_exchange.accepted ? "border-green-400" : "")} key={class_exchange.course_unit}>
                    <div className="flex flex-col space-y-2">
                        <span className="font-bold text-center">{class_exchange.course_unit}</span>
                        <div className="flex flex-end">
                            {/* The new class of the other student is our old class */}
                            <p>{class_exchange.new_class}</p>
                            <span>
                                <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                            </span>
                            <p>{class_exchange.old_class}</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 mr-0">
                        <span className="font-bold text-center">Estudante</span>
                        <span className="">{class_exchange.other_student}</span>
                    </div>
                </div>
            ))
        }
    </div>

}
