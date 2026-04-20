import React from 'react'

function ProjectsPreview({ resumeInfo }) {

  if (!resumeInfo?.projects?.length) return null

  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2'
        style={{ color: resumeInfo?.themeColor }}>
        Projects
      </h2>

      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo.projects.map((project, index) => (
        <div key={index} className='my-3'>
          <h2 className='font-bold text-sm'>
            {project.title}
          </h2>
          <p className='text-xs'>
            {project.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ProjectsPreview