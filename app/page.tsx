import { Suspense } from 'react'
import {
  GenericSection,
  HeroSection,
  CallToActionSection,
  FrequentQuestions,
  Footer,
} from './components'
import Loading from './loading'
import { sections } from './components/Mock'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <div className='flex flex-col items-center'>
        <HeroSection />
        <CallToActionSection />
        {sections.map((section, index) => {
          return (
            <GenericSection
              key={index}
              sectionName={section.sectionName}
              title={section.title}
              subtitle={section.subtitle}
              color={section.color}
              features={section.features}
              gradientColor={section.gradientColor}
              image={section.image}
            />
          )
        })}
        <FrequentQuestions />
      </div>
      <Footer />
    </Suspense>
  )
}
