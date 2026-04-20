import React from 'react'

function ExperiencePreview({ resumeInfo }) {
  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2'>
        Professional Experience
      </h2>
      <hr />

      {resumeInfo?.experience?.map((item, index) => (
        <div key={index} className='my-4'>
          
          <h2 className='text-sm font-bold'>
            {item?.title}
          </h2>

          <h2 className='text-xs flex justify-between'>
            {item?.companyName}, {item?.city}, {item?.state}
            <span>
              {item?.startDate} To {item?.endDate}
            </span>
          </h2>

          <div
            className='text-xs my-2'
            dangerouslySetInnerHTML={{
              __html: item?.summery
            }}
          />

        </div>
      ))}
    </div>
  )
}

export default ExperiencePreview