import React, { useState, useRef } from 'react';
import { ArrowRightIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button} from '../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

const ExchangeDetail = ({ exchangeDetail }) => (
    <div className="flex flex-col space-y-2 w-full mb-2">
        <div className="font-bold text-left">{exchangeDetail.course}</div>
        <div className="flex flex-row items-center space-x-2 w-full">
            <input disabled type="text" className="w-1/2 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white border-gray-200 rounded-md" placeholder={exchangeDetail.from}></input>
            <span>
                <ArrowRightIcon className="h-5 w-full"></ArrowRightIcon>
            </span>
            <input disabled type="text" className="w-1/2 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white border-gray-200 rounded-md" placeholder={exchangeDetail.to}></input>
        </div>
    </div>
);

const Exchange = ({ exchange }) => (
    <div className="border-2 border-gray-200 shadow-sm bg-white p-4 rounded-md w-1/4">
        <h3 className="font-bold text-lg text-center">{exchange.studentName}</h3>
        {exchange.exchanges.map((exchangeDetail) => (
            <ExchangeDetail key={exchangeDetail.course} exchangeDetail={exchangeDetail} />
        ))}
    </div>
);

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const searchInputRef = useRef(null);

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
                        >
                            <FunnelIcon className="h-5 w-5" /> 
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filtrar pesquisa</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

const MarketplacePage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const marketplaceExchanges = [
        {
            studentName: 'Pedro Oliveira',
            exchanges: [
                { course: 'Inteligência Artificial', from: '3LEIC04', to: '3LEIC02' },
                { course: 'Computação Paralela e Distribuída', from: '3LEIC04', to: '3LEIC02' }
            ]
        },
        {
            studentName: 'João Fernades',
            exchanges: [
                { course: 'Compiladores', from: '3LEIC02', to: '3LEIC08' }
            ]
        },
        {
            studentName: 'Tomás Palma',
            exchanges: [
                { course: 'Inteligência Artificial', from: '3LEIC01', to: '3LEIC06' },
                { course: 'Computação Paralela e Distribuída', from: '3LEIC01', to: '3LEIC06' },
                { course: 'Compiladores', from: '3LEIC01', to: '3LEIC06' }
            ]
        },
        {
            studentName: 'Eduardo Oliveira',
            exchanges: [
                { course: 'Competências Transversais: Comunicação Profissional', from: '3LEIC01', to: '3LEIC06' }
            ]
        }        
    ];

    const filteredExchanges = marketplaceExchanges.filter(exchange =>
        exchange.exchanges.some(detail =>
            detail.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.to.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="p-4">
            <div className="flex flex-col items-center w-full justify-between space-y-4 border-2 border-gray-200 shadow-sm bg-white p-4 rounded-md">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {filteredExchanges.map((exchange) => (
                    <Exchange key={exchange.studentName} exchange={exchange} />
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;