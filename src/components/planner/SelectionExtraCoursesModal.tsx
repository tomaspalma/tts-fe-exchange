import classNames from 'classnames'
import BackendAPI from '../../api/backend'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Fragment, SetStateAction, useEffect, useMemo, useState } from 'react'
import Alert, { AlertType } from './Alert'
import { Link } from 'react-router-dom'
import { CheckedCourse, Course, Major } from '../../@types'
import { getSchoolYear, getSemester, config, getPath } from '../../utils'
import {
  AcademicCapIcon,
  CheckCircleIcon,
  CheckIcon,
  HomeIcon,
  InboxInIcon,
  MinusCircleIcon,
  PencilAltIcon,
  PlusCircleIcon,
  SelectorIcon,
  PlusIcon,
  XIcon,
} from '@heroicons/react/solid'

type Props = {
  majors: Major[]
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  restoreCoursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
}

const SelectionExtraCoursesModal = ({ majors, openHook, majorHook, coursesHook, restoreCoursesHook }: Props) => {
  const [major, setMajor] = majorHook
  const [isThisOpen, setisThisOpen] = openHook
  const [courses, setCourses] = coursesHook
  const [storagedCheckedCourses, setStoragedCheckedCourses] = restoreCoursesHook
  const [selected, setSelected] = useState<Major>(major)
  const [majorQuery, setMajorQuery] = useState<string>('')
  //const [extraCoursesQuery, setExtraCoursesQuery] = useState<string>('')
  const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info)
  const atLeastOneCourse = courses.some((item) => item?.some((course) => course.checked))

  const match = (str: string, query: string, simple?: boolean) =>
    simple
      ? str.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
      : str
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/\s+/g, '')
          .replace('.', '')
          .replace(':', '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))

  const filteredMajors =
    majors !== null && majors?.length !== 0 && Array.isArray(majors)
      ? majorQuery === ''
        ? majors
        : majors.filter(
            (major: Major) =>
              match(major?.name, majorQuery, true) ||
              match(major?.name, majorQuery, false) ||
              match(major?.acronym, majorQuery, true) ||
              match(major?.acronym, majorQuery, false)
          )
      : []

  const closeModal = () => {
    if (major?.name === '' || !atLeastOneCourse)
      setAlertLevel(AlertType.warning)
    
    setCourses([courses[0], ...storagedCheckedCourses])

    setisThisOpen(false)
  }

  const openModal = () => {
    setisThisOpen(true)
  }

  const getDisplayMajorText = (major: Major) => (major === null ? '' : `${major?.name} (${major?.acronym})`)

  const getDisplayExtraCourseText = (course: Course) =>
    course === null ? '' : `${course?.name} (${course?.acronym}, ${course?.course})`

  /**
   * If the first index of the courses array is undefined or null, it puts an empty array instead
   * This is useful because the index 0 of the courses checked course matrix is the extra courses the user selected
   * besides their default major
   */
  const trimExtraCourses = () => {
    if(courses[0] === undefined || courses[0] === null) {
      courses[0] = []
    } 
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, year: number, courseIdx: number) => {
    courses[year + 1][courseIdx].checked = event.target.checked

    trimExtraCourses()
    
    if(event.target.checked) {
      let course_to_add: CheckedCourse = courses[year + 1][courseIdx]

      courses[0].push(course_to_add)
    } else {
      let course_to_remove: CheckedCourse = courses[year + 1][courseIdx]
      let course_to_remove_index: number = courses[0].indexOf(course_to_remove, 1)

      courses[0].splice(course_to_remove_index, 1)
    }

    setCourses([...courses])
  }

  const handleCheckGroup = (event: React.ChangeEvent<HTMLInputElement>, year: number) => {
    trimExtraCourses()

    courses[year].forEach((course: CheckedCourse) => {
      courses[0].push(course)
      course.checked = event.target.checked
    })
    //courses[year] = newGroupEntry
    setCourses([...courses])
  }

  useEffect(() => {
    if (major?.name !== '' && atLeastOneCourse) setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [major, courses, atLeastOneCourse])

  useEffect(() => {
    for (let year = 1; year < courses.length; year++) {
      let some = courses[year].some((course) => course.checked)
      let every = courses[year].every((course) => course.checked)

      //@ts-ignore
      let checkbox: HTMLInputElement = document.getElementById(`year-checkbox-${year}`)
      if (!checkbox) return

      if (every) {
        checkbox.checked = true
        checkbox.indeterminate = false
      } else if (some) {
        checkbox.checked = false
        checkbox.indeterminate = true
      } else {
        checkbox.checked = false
        checkbox.indeterminate = false
      }
    }
  }, [courses])

  const isExtraCourseSet = (course: CheckedCourse) => {

    if(courses[0] === undefined || courses[0] === null)
      return

    let possible_course_index: number = courses[0].findIndex(
        related_course => related_course.info.course_unit_id === course.info.course_unit_id
      )


    if(possible_course_index !== -1) {
      return courses[0][possible_course_index].checked
    }

    return false
  }

  return (
    <>
      <Transition appear show={isThisOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <OuterMask />
          <div className="fixed inset-0 bottom-0 overflow-y-auto xl:bottom-12">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel
                  className={classNames(
                    'w-full max-w-6xl transform space-y-2 rounded-2xl p-4 text-left lg:space-y-3 lg:p-6',
                    'bg-lightest align-middle shadow-xl transition-all dark:bg-dark'
                  )}
                >
                  {/* Header */}
                  <Dialog.Title
                    as="header"
                    className="mb-2 flex w-full items-center justify-between space-x-2 text-center font-medium lg:mb-3"
                  >
                    <div className="flex items-center justify-start space-x-1">
                      <AcademicCapIcon className="h-6 w-6 text-feup" aria-hidden="true" />
                      <h3 className="flex text-xl font-semibold leading-6 tracking-tight dark:text-white lg:hidden">
                        UCs
                      </h3>
                      <h3 className="hidden text-xl font-semibold leading-6 tracking-tight dark:text-white lg:flex">
                        Escolha de UCs de outros cursos
                      </h3>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                      <span
                        title="Semestre"
                        className="rounded bg-feup px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {`${getSemester()}ºS`}
                      </span>
                      <span
                        title="Ano Letivo"
                        className="rounded bg-feup px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {getSchoolYear()}
                      </span>
                    </div>
                  </Dialog.Title>

                  {/* Credits banner */}
                  {/* <CreditsBanner courses={courses.flat().filter((course) => course.checked)} /> */}

                  {/* Alert banner */}
                  <Alert type={alertLevel}>
                    Selecione o seu outro <strong>curso</strong>, seguido das <strong>Unidades Curriculares</strong>{' '}
                    pretendidas, como anteriormente.
                  </Alert>

                  {/* Select major dropdown */}
                  <Combobox
                    value={selected}
                    onChange={(value) => {
                      setMajor(value)
                      setSelected(value)
                    }}
                  >
                    <div className="relative">
                      <div className="relative w-full rounded text-left">
                        <Combobox.Input
                          placeholder={
                            window.matchMedia('(max-width: 1024px)').matches === true
                              ? 'Pesquise o seu curso pelo nome ou sigla'
                              : 'Escolha e/ou digite o nome ou sigla do seu ciclo de estudos'
                          }
                          className={classNames(
                            selected !== null ? 'font-semibold' : '',
                            'w-full rounded border-2 py-3 pl-4 pr-8 text-xs leading-5 md:text-sm',
                            'border-gray-700/25 bg-gray-50 text-gray-700 focus:shadow focus:ring-0'
                          )}
                          displayValue={(major: Major) => getDisplayMajorText(major)}
                          onChange={(event: { target: { value: SetStateAction<string> } }) =>
                            setMajorQuery(event.target.value)
                          }
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-7 w-7 rounded-full py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setMajorQuery('')}
                      >
                        <Combobox.Options
                          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded border
                         border-gray-500 bg-lightest py-2 text-xs dark:bg-lighter sm:text-sm"
                        >
                          {filteredMajors.length === 0 && majorQuery !== '' ? (
                            <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 dark:text-white">
                              Nenhum curso encontrado com este nome.
                            </div>
                          ) : (
                            filteredMajors.map((major: Major, majorIdx: number) => (
                              <Combobox.Option
                                key={`major-${majorIdx}`}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 px-3 ${
                                    major?.name !== '' ? 'pl-10' : 'pl-4'
                                  } ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                                }
                                value={major}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                      {getDisplayMajorText(major)}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active ? 'text-white' : 'text-primary'
                                        }`}
                                      >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>

        

                  {/* Courses checkboxes */}
                  <div className="checkboxes"> 
                    {major &&
                      courses.slice(1).map((year: CheckedCourse[], yearIdx: number) => (
                        <div key={`year-${yearIdx}`}>
                          {/* Parent checkbox */}
                          <div title={`${major?.acronym} ${yearIdx + 1}º ano`} className="flex items-center transition">
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={courses[yearIdx + 1].every((course) => course.checked)}
                              id={`year-checkbox-${yearIdx}`}
                              onChange={(event) => handleCheckGroup(event, yearIdx + 1)}
                            />
                            <label
                              className="ml-2 block cursor-pointer text-sm font-semibold dark:text-white"
                              htmlFor={`year-checkbox-${yearIdx}`}
                            >
                              <span>{yearIdx + 1}º Ano</span>
                            </label>
                          </div>

                          {/* Children checkboxes */}
                          <div className="mt-2 ml-4 grid grid-flow-col grid-rows-8 gap-x-1 gap-y-1.5 p-1">
                            {year.map((course: CheckedCourse, courseIdx: number) => (
                              <div
                                title={course?.info.name}
                                key={`checkbox-${yearIdx}-${courseIdx}`}
                                className="flex items-center transition"
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={isExtraCourseSet(course) || courses[yearIdx + 1][courseIdx].checked}
                                  id={`course-checkbox-${yearIdx}-${courseIdx}`}
                                  onChange={(event) => handleCheck(event, yearIdx, courseIdx)}
                                />
                                <label
                                  className="ml-1.5 block cursor-pointer text-sm dark:text-white"
                                  htmlFor={`course-checkbox-${yearIdx}-${courseIdx}`}
                                >
                                  {course.info.acronym}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Bottom action buttons */}
                  <footer className="flex flex-col items-center justify-between gap-y-2 lg:flex-row lg:gap-y-0">
                    {/* Left side buttons */}
                    <div className="order-last flex w-full flex-col space-x-0 space-y-2 lg:order-first lg:flex-row lg:space-x-3 lg:space-y-0">
                      {/* Contact us link */}
                      <a
                        type="button"
                        className={classNames(
                          'flex items-center justify-center space-x-1 rounded px-4 py-2 text-sm font-medium lg:space-x-2',
                          'border-2 border-gray-700 text-gray-700 transition hover:bg-gray-700 hover:text-white',
                          'dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700'
                        )}
                        href="mailto:projetos.niaefeup@gmail.com"
                      >
                        <InboxInIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="hidden md:flex">Contacte-nos</span>
                        <span className="flex md:hidden">Contactar</span>
                      </a>
                      {/* Go back to about page button */}
                      <Link
                        to={getPath(config.paths.about)}
                        className={classNames(
                          'flex items-center justify-center space-x-1 rounded px-4 py-2 text-sm font-medium lg:space-x-2',
                          'border-2 border-gray-700 text-gray-700 transition hover:bg-gray-700 hover:text-white',
                          'dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700'
                          // major === null ? 'hidden' : ''
                        )}
                      >
                        <HomeIcon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                        <span>Voltar</span>
                      </Link>
                    </div>

                    {/* Right side buttons */}
                    <div className="order-first flex w-full flex-col items-center justify-center space-x-0 space-y-2 lg:order-last lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-3">
                      {/* Go back to the main selection modal button */}
                      {/* Confirm options button */}
                      <button
                        type="button"
                        title="Avançar para seleção de horários"
                        className={classNames(
                          'flex w-full items-center justify-center space-x-1 rounded border-2 px-4 py-2 text-sm font-medium transition lg:w-auto',
                          'border-teal-700/50 bg-green-50 text-teal-700 dark:border-teal-700 hover:bg-green-700 hover:text-white',
                        )}
                        onClick={closeModal}
                      >
                        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Confirmar</span>
                      </button>
                    </div>
                  </footer>
                </Dialog.Panel>
              </InnerCustomTransition>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

/* Masks outer background */
const OuterMask = () => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="fixed inset-0 bg-black/50 dark:bg-black/50" />
  </Transition.Child>
)

/* Modal inner content custom transition */
const InnerCustomTransition = ({ children, ...props }: any) => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
    {...props}
  >
    {children}
  </Transition.Child>
)

export default SelectionExtraCoursesModal
