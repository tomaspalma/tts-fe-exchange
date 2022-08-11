import { PlannerFaqs, ExchangeFaqs, HeaderFaqs } from '../components/faqs'

const FaqsPage = () => {
  return (
    <div className="container mx-auto w-full max-w-7xl space-y-4 py-6 px-4 md:py-10 md:px-6">
      <HeaderFaqs />
      <PlannerFaqs />
      <ExchangeFaqs />
    </div>
  )
}
export default FaqsPage
