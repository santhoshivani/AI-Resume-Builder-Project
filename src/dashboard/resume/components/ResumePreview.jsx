import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'
import ProjectsPreview from './preview/ProjectsPreview'

function ResumePreview() {

    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext)

  return (
  <div
    className='shadow-lg h-full p-14 border-t-[20px]'
    style={{
      borderColor: resumeInfo?.themeColor
    }}
  >
    {/* Personal Detail */}
    <PersonalDetailPreview resumeInfo={resumeInfo} />

    {/* Summary */}
    <SummeryPreview resumeInfo={resumeInfo} />

    {/* ✅ EDUCATION FIRST */}
    {resumeInfo?.education?.length > 0 && (
      <EducationalPreview resumeInfo={resumeInfo} />
    )}

    {/* ✅ PROJECTS NEXT */}
    {resumeInfo?.projects?.length > 0 && (
      <ProjectsPreview resumeInfo={resumeInfo} />
    )}

    {/* ✅ EXPERIENCE AFTER */}
    {resumeInfo?.experience?.length > 0 && (
      <ExperiencePreview resumeInfo={resumeInfo} />
    )}

    {/* ✅ SKILLS LAST */}
    {resumeInfo?.skills?.length > 0 && (
      <SkillsPreview resumeInfo={resumeInfo} />
    )}
  </div>
)
}

export default ResumePreview