import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Summery from './forms/Summery'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import Projects from './forms/Projects'
import ThemeColor from './ThemeColor'

function FormSection() {

  const [activeFormIndex, setActiveFormIndex] = useState(1)
  const [enableNext, setEnableNext] = useState(true)
  const { resumeId } = useParams()

  return (
    <div>

      {/* HEADER */}
      <div className='flex justify-between items-center'>

        <div className='flex gap-5'>
          <Link to={"/dashboard"}>
            <Button><Home /></Button>
          </Link>

          <ThemeColor />
        </div>

        <div className='flex gap-2'>

          {/* BACK BUTTON */}
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              onClick={() => setActiveFormIndex(prev => prev - 1)}
            >
              <ArrowLeft />
            </Button>
          )}

          {/* NEXT BUTTON */}
          <Button
            disabled={!enableNext}
            className="flex gap-2"
            size="sm"
            onClick={() => setActiveFormIndex(prev => prev + 1)}
          >
            Next <ArrowRight />
          </Button>

        </div>
      </div>

      {/* FORM SECTIONS */}

      {activeFormIndex === 1 && (
        <PersonalDetail enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 2 && (
        <Summery enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 3 && (
        <Experience enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 4 && (
        <Education enabledNext={setEnableNext} />
      )}

      {/*  NEW PROJECTS SECTION */}
      {activeFormIndex === 5 && (
        <Projects enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 6 && (
        <Skills enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 7 && (
        <Navigate to={`/my-resume/${resumeId}/view`} />
      )}

    </div>
  )
}

export default FormSection