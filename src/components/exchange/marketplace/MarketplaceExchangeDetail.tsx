import { ArrowRightIcon } from "lucide-react";

export const MarketplaceExchangeDetail = ({ exchangeDetail }) => (
    <div className="flex flex-col space-y-2 w-full mb-2">
        <div className="font-bold text-left">{exchangeDetail.course_unit}</div>
        <div className="flex flex-row items-center space-x-2 w-full">
            <input disabled type="text" className="w-1/2 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white border-gray-200 rounded-md" placeholder={exchangeDetail.old_class}></input>
            <span>
                <ArrowRightIcon className="h-5 w-full"></ArrowRightIcon>
            </span>
            <input disabled type="text" className="w-1/2 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white border-gray-200 rounded-md" placeholder={exchangeDetail.new_class}></input>
        </div>
    </div>
);