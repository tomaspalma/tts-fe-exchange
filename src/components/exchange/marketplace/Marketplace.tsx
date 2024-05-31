import React, { useState, useRef, Fragment, useEffect, useContext } from 'react';
import { ArrowRightIcon, MagnifyingGlassIcon, FunnelIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button} from '../../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Dialog, Transition } from '@headlessui/react';
import Alert, { AlertType } from '../../planner/Alert';
import classNames from 'classnames'
import { SessionContext } from '../../../contexts/SessionContext';
import { useMarketplaceExchange } from '../../../api/hooks/useMarketplaceExchange';
import { getStudentData } from '../../../api/backend';
import { convertSigarraCoursesToTtsCourses } from '../../../utils/utils';
import { useSchedule } from '../../../api/hooks/useSchedule';
import { MarketplaceExchange } from './MarketplaceExchange';

const SearchBar = ({ searchTerm, setSearchTerm, selectedUCs, setSelectedUCs })  => {
    const searchInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false);

    const handleCheckboxChange = (event) => {
        setSelectedUCs({ ...selectedUCs, [event.target.name]: event.target.checked });
    };

    const handleParentCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setSelectedUCs(prevUCs => {
            const newUCs = { ...prevUCs };
            for (let uc in newUCs) {
                newUCs[uc] = isChecked;
            }
            return newUCs;
        });
    };

    const isAllChecked = Object.values(selectedUCs).every(val => val);

    return (
        <div className="relative w-full max-w-md flex">
            <input
                ref={searchInputRef}
                type="text"
                className="block w-full mr-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border rounded-md"
                placeholder="Pesquisar por turma ou unidade curricular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="icon"
                            className="h-min w-min flex-grow bg-primary mr-2"
                            onClick={() => searchInputRef.current.focus()}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pesquisar</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="icon"
                            className="h-min w-min flex-grow bg-secondary"
                            onClick={openModal}
                        >
                            <FunnelIcon className="h-5 w-5" /> 
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filtrar pesquisa</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <FilterDialog 
                isOpen={isOpen} 
                closeModal={closeModal} 
                selectedUCs={selectedUCs} 
                handleCheckboxChange={handleCheckboxChange} 
                handleParentCheckboxChange={handleParentCheckboxChange} 
                isAllChecked={isAllChecked} 
            />
        </div>
    );
};

const FilterDialog = ({ isOpen, closeModal, selectedUCs, handleCheckboxChange, handleParentCheckboxChange, isAllChecked }) => {
    const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info);

    useEffect(() => {
        if (Object.values(selectedUCs).some(val => val)) {
            setAlertLevel(AlertType.success);
        } else {
            setAlertLevel(AlertType.info);
        }
    }, [selectedUCs]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
              <Dialog.Panel className="inline-block w-full max-w-xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-auto flex-col">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 ">
                  Filtrar pesquisa por UCs
                </Dialog.Title>
                <div className="mt-2">
                  <Alert type={alertLevel}> {/* Update alert text to use Alert component */}
                    Selecione as unidades curriculares que deseja trocar.
                  </Alert>
                </div>
                <div className="mt-4 flex-grow">
                  <div className="flex items-center transition">
                    <input
                      id="selectAll"
                      type="checkbox"
                      className="checkbox"
                      name="UCs"
                      checked={isAllChecked}
                      onChange={handleParentCheckboxChange}
                    />
                    <label htmlFor="selectAll" className='ml-2 block cursor-pointer text-sm font-semibold dark:text-white'>
                      Selecionar todas
                    </label>
                  </div>
                  <div className="mt-2 ml-4 grid grid-flow-row gap-x-1 gap-y-1.5 p-1">
                    {Object.keys(selectedUCs).map((uc, idx) => (
                      <div key={uc} className="flex items-center transition">
                        <input
                          id={`uc-checkbox-${idx}`}
                          type="checkbox"
                          className="checkbox"
                          name={uc}
                          checked={selectedUCs[uc]}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor={`uc-checkbox-${idx}`} className='ml-2 block cursor-pointer text-sm dark:text-white'>
                          {uc}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        title="Confirmar seleção"
                        className={classNames(
                        'flex w-full items-center justify-center space-x-1 rounded border-2 px-4 py-2 text-sm font-medium transition lg:w-auto',
                        'border-teal-700/50 bg-green-50 text-teal-700 dark:border-teal-700',
                        Object.values(selectedUCs).some(val => val)
                            ? 'hover:bg-teal-700 hover:text-white'
                            : 'cursor-not-allowed opacity-50'
                        )}
                        onClick={closeModal}
                        disabled={!Object.values(selectedUCs).some(val => val)}
                    >
                        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Confirmar</span>
                    </button>
                    </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      );
};

const MarketplacePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const [studentData, setStudentData] = useState({});
    /*
    const [selectedUCs, setSelectedUCs] = useState({
        'Compiladores': false,
        'Inteligência Artificial': false,
        'Computação Paralela e Distribuída': false,
        'Computação Gráfica': false
    });
    */
    const [selectedUCs, setSelectedUCs] = useState({});
    const username = localStorage.getItem("username");
    const { data: schedule, isLoading: isLoadingSchedule, isValidating: isValidatingSchedule } = useSchedule(username, loggedIn);

    const { data: marketplaceExchanges, isLoading, error } = useMarketplaceExchange(loggedIn);

    useEffect(() => {
        if (!isLoadingSchedule && !isValidatingSchedule && schedule) {
            console.log('Schedule: ', schedule);
            const ttsSchedule = schedule.reduce((acc, course) => {
                const courseName = convertSigarraCoursesToTtsCourses([course])[0].course.info.name;
                acc[courseName] = false;
                return acc;
            }, {});
            setSelectedUCs(ttsSchedule);
        }
    }, [schedule, isLoadingSchedule, isValidatingSchedule]);

    useEffect(() => {
        if (marketplaceExchanges) {
            const fetchStudentData = async () => {
                const newStudentData = {};
                for (let exchange of marketplaceExchanges) {
                    const data = await getStudentData(exchange.issuer);
                    const fullName = data.nome.split(' ');
                    const firstName = fullName[0];
                    const lastName = fullName[fullName.length - 1];
                    newStudentData[exchange.issuer] = `${firstName} ${lastName}`;
                }
                setStudentData(newStudentData);
            };
            fetchStudentData();
        }
    }, [marketplaceExchanges]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    const filteredExchanges = marketplaceExchanges && marketplaceExchanges.filter(exchange =>
        exchange.class_exchanges.some(detail =>
            (detail.course_unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.old_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.new_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exchange.issuer.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (Object.values(selectedUCs).every(val => !val) || exchange.class_exchanges.some(detail => selectedUCs[detail.course_unit]))
        )
    );

    return (
        <div className="p-4">
            <div className="flex flex-col items-center w-full justify-between space-y-4 border-2 border-gray-200 shadow-sm bg-white p-4 rounded-md">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedUCs={selectedUCs} setSelectedUCs={setSelectedUCs} />
                {filteredExchanges.length > 0 ? (
                    filteredExchanges.map((exchange) => (
                        <MarketplaceExchange key={exchange.id} exchange={exchange} studentData={studentData} />
                    ))
                ) : (
                    <div className="flex flex-col items-center w-full justify-between space-y-4">
                        <Alert type={AlertType.info}>
                            Ainda não foram submetidas trocas no marketplace
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;