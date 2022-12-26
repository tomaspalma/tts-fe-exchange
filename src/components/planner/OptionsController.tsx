import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { MultipleOptions } from '../../@types'

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const OptionsController = ({ multipleOptionsHook }: Props) => {
  const [options, setOptions] = multipleOptionsHook
  const optionIndexes = Array.from({ length: 10 }, (_, i) => i)
  const optionsNames = Array.from({ length: 10 }, (_, i) => `Horário ${i + 1}`)

  const setNextOptionIndex = () => {
    setOptions((prev) => ({
      index: prev.index + 1,
      selected: prev.options[prev.index + 1],
      options: [...prev.options],
    }))
  }

  const setPreviousOptionIndex = () => {
    setOptions((prev) => ({
      index: prev.index - 1,
      selected: prev.options[prev.index - 1],
      options: [...prev.options],
    }))
  }

  const setOptionIndex = (newIndex: number) => {
    setOptions((prev) => ({
      index: newIndex,
      selected: prev.options[newIndex],
      options: [...prev.options],
    }))
  }

  const renameOption = () => {
    optionsNames[options.index] = <input type="text" />
  }

  return (
    <div className="flex w-full rounded text-xs">
      <button
        disabled={options.index === 0}
        onClick={setPreviousOptionIndex}
        title="Ver opção de horário anterior"
        className="w-min items-center justify-center gap-1.5 rounded-l border-2 border-transparent bg-secondary px-2 py-2
        text-center font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      <Menu as="div" className="relative inline-block w-full text-left">
        <Menu.Button
          title="Escolher uma opção de horário"
          className="flex h-auto w-full items-center justify-center space-x-2 border-2 border-secondary bg-secondary px-2 py-2 
          font-medium text-white transition hover:opacity-80 dark:bg-secondary"
        >
          <span> {optionsNames[options.index]} </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 z-20 mt-2 flex w-full origin-top-right flex-col gap-1 rounded
            border-2 border-lightish bg-lightest p-1.5 shadow-xl dark:border-transparent dark:bg-darkest xl:gap-2"
          >
            {optionIndexes.map((index: number) => (
              <Menu.Item key={`schedule-option-${index}`}>
                {({ active }) => (
                  <button
                    onClick={() => setOptionIndex(index)}
                    className={`
                      ${active ? 'bg-secondary text-white' : ''}
                      ${index === options.index ? 'bg-secondary text-white hover:opacity-90' : !active && ''}
                      group relative flex w-full cursor-pointer select-none items-center gap-2 rounded py-2 px-3 transition-all
                    `}
                  >
                    <span>{optionsNames[index]}</span>
                    <input type="text" className='h-4 w-1/2 text-black'/>
                    {index === options.index && <CheckIcon className="h-4 w-4" />}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        disabled={options.index === 9}
        onClick={setNextOptionIndex}
        title="Ver opção de horário seguinte"
        className="w-min items-center justify-center gap-1.5 rounded-r border-2 border-transparent bg-secondary px-2 py-2
        text-center font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export default OptionsController
