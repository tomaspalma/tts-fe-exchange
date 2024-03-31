import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";
import { getStudentSchedule, logout } from "../../api/backend";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { SubmitDirectExchangeButton } from "./SubmitDirectExchangeButton";
import { ClassExchange, CourseOption, ExchangeCourseUnit } from "../../@types";
import { MoonLoader } from "react-spinners";
import { DirectExchangeInfoButton } from "./buttons/DirectExchangeInfoButton";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ToggleMarketplaceSubmissionMode } from "./marketplace/ToggleMarketplaceSubmissionMode";
import { DirectExchangeContext } from "../../contexts/DirectExchangeContext";

type props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
}

export function DirectExchange({
    setCourseOptions
}) {
    const [currentDirectExchange, setCurrentDirectExchange] = useState<Map<string, ClassExchange>>(new Map<string, ClassExchange>());
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const [marketplaceToggled, setMarketplaceToggled] = useState(false);

    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getStudentSchedule(username);
                if (data.status === 403) {
                    setLoggedIn(false);
                    await logout();
                } else {
                    setSchedule(data.filter(course => course.tipo === "TP")
                        .map(course => ({
                            sigla: course.ucurr_sigla,
                            name: course.ucurr_nome,
                            class: course.turma_sigla,
                            code: course.ocorrencia_id
                        })));
                    // setCourseOptions(data.filter(course => course.tipo === "TP").map(course => ({
                    //     shown: {
                    //         T: false,
                    //         TP: true,
                    //     },
                    //     locked: false,
                    //     course: {
                    //         checked: true,
                    //         info: {}
                    //     },
                    //     option: {
                    //         day: course.dia,
                    //         duration: course.aula_duracao,
                    //         start_time: course.hora_inicio,
                    //         location: course.sala_sigla,
                    //         lesson_type: course.tipo,
                    //         is_composed: false,
                    //         course_unit_id: course.ocorrencia_id,
                    //         last_updated: "",
                    //         composed_class_name: "",
                    //         professors_link: "",
                    //         professor_information: []
                    //     },
                    //     schedules: [{
                    //         day: course.dia,
                    //         duration: course.aula_duracao,
                    //         start_time: course.hora_inicio,
                    //         location: course.sala_sigla,
                    //         lesson_type: course.tipo,
                    //         is_composed: false,
                    //         course_unit_id: course.ocorrencia_id,
                    //         last_updated: "",
                    //         composed_class_name: "",
                    //         professors_link: "",
                    //         professor_information: []
                    //     }],
                    //     teachers: [],
                    //     filteredTeachers: []
                    // })))
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    return <DirectExchangeContext.Provider value={
        {
            marketplaceToggled: marketplaceToggled,
            setMarketplaceToggled: setMarketplaceToggled,
            currentDirectExchange: currentDirectExchange,
            setCurrentDirectExchange: setCurrentDirectExchange
        }}>
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <DirectExchangeInfoButton />
            <SubmitDirectExchangeButton currentDirectExchange={currentDirectExchange} />
            <ToggleMarketplaceSubmissionMode />
            {!isLoading ?
                <div>
                    {
                        schedule.map((uc) => {
                            return (
                                <DirectExchangeSelection
                                    uc={uc}
                                    key={uc.ucName}
                                />
                            )
                        })
                    }
                </div> : <div className="mt-4">
                    <MoonLoader className="mx-auto my-auto" loading={isLoading} />
                    <p className="text-center">A carregar os horários</p>
                </div>}
        </div>
    </DirectExchangeContext.Provider>
}
