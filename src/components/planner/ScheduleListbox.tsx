import { useState, useEffect, Fragment, useMemo } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { CourseOption, CourseOptions, CourseSchedule } from '../../@types'
import { convertHour, convertWeekday } from '../../utils'

type Props = {
  courseOption: CourseOption
  selectedHook: [CourseOptions, React.Dispatch<React.SetStateAction<CourseOptions>>]
}

const ScheduleListbox = ({ courseOption, selectedHook }: Props) => {
  const [, setSelected] = selectedHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(null)
  const [classesTShown, setClassesTShown] = useState<boolean>(true)
  const [classesTPShown, setClassesTPShown] = useState<boolean>(true)

  const adaptedSchedules = useMemo(() => {
    return [null, courseOption.schedules]
      .flat()
      .filter((option: CourseSchedule | null) => null || option?.class_name !== null)
  }, [courseOption])

  const getOptionDisplayText = (option: CourseSchedule | null) => {
    if (option === null || !option.course_unit_id) return <>&nbsp;</>
    return `${option.class_name}, ${option.teacher_acronym}, ${convertWeekday(option.day)}, ${convertHour(option.start_time)}-${convertHour(option.start_time + option.duration)}` //prettier-ignore
  }

  const updateShown = (type: 't' | 'tp', value: boolean): void => {
    if (type === 't') {
      setClassesTShown(value)
    } else if (type === 'tp') {
      setClassesTPShown(value)
    }
  }

  useEffect(() => {
    setSelectedOption(null)
  }, [courseOption])

  useEffect(() => {
    const resolveSelected = (prevSelected: CourseOptions) => {
      let newSelected = prevSelected
      prevSelected.forEach((option, optionIdx) => {
        if (option === courseOption) {
          newSelected[optionIdx].option = selectedOption
        }
      })
      return newSelected
    }
    setSelected((prevSelected) => [...resolveSelected(prevSelected)])
  }, [selectedOption, courseOption, setSelected])

  return adaptedSchedules ? (
    <Listbox
      value={selectedOption}
      onChange={(value) => (value.course_unit_id ? setSelectedOption(value) : setSelectedOption(null))}
    >
      <div className="relative text-sm">
        <h4 className="mb-1 text-xs">
          {courseOption.course.info.name} (<strong>{courseOption.course.info.acronym}</strong>)
        </h4>
        <Listbox.Button
          className="group relative w-full cursor-pointer rounded border-2 border-transparent bg-lightish py-1.5 pl-2 pr-9 text-left 
          text-xs transition hover:bg-primary/75 dark:bg-darkish dark:shadow dark:hover:bg-primary/50 2xl:py-2 2xl:pl-3 2xl:pr-10 2xl:text-sm"
        >
          <span className="block truncate font-medium group-hover:text-white">
            {getOptionDisplayText(selectedOption)}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 group-hover:text-white">
            <SelectorIcon className="h-5 w-5 transition" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-20 mt-1 max-h-36 w-full overflow-auto rounded border bg-lightest py-1 text-sm tracking-tight dark:bg-darkish lg:max-h-72 xl:text-base">
            {adaptedSchedules.map((option, personIdx) => (
              <Listbox.Option
                key={personIdx}
                value={option === null ? <>&nbsp;</> : option}
                className={({ active }) =>
                  `group relative cursor-default select-none py-2 ${selectedOption !== null ? 'pl-10' : 'pl-4'} pr-4 ${
                    active ? 'bg-primary/75 text-white dark:bg-primary/75' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate dark:text-white ${selected ? 'font-medium' : 'font-normal'}`}>
                      {getOptionDisplayText(option)}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-primary dark:text-white'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>

        {/* Show/Hide Checkboxes */}
        <div className="mt-1.5 flex items-center justify-start space-x-4">
          <div className="flex items-center justify-center space-x-1">
            <input
              type="checkbox"
              id={`checkbox-classes-t-${courseOption.course.info.acronym}`}
              className="checkbox-small"
              checked={classesTShown}
              onChange={(event) => updateShown('t', event.target.checked)}
            />
            <label
              className="cursor-pointer text-xs font-medium capitalize tracking-tight"
              htmlFor={`checkbox-classes-t-${courseOption.course.info.acronym}`}
            >
              <span>Teóricas</span>
            </label>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <input
              type="checkbox"
              id={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
              className="checkbox-small"
              checked={classesTPShown}
              onChange={(event) => updateShown('tp', event.target.checked)}
            />
            <label
              className="cursor-pointer text-xs font-medium capitalize tracking-tight"
              htmlFor={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
            >
              <span>Práticas</span>
            </label>
          </div>
        </div>
      </div>
    </Listbox>
  ) : null
}

export default ScheduleListbox
