import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../../components/FormSection'
import ResumePreview from '../../components/ResumePreview'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'

function EditResume() {
  const { resumeId } = useParams()
  const [resumeInfo, setResumeInfo] = useState(null)

  useEffect(() => {
    console.log("Resume ID 👉", resumeId)
    GetResumeInfo()
  }, [])

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId)
      .then((resp) => {
        console.log("RAW RESPONSE 👉", resp.data)

        // ✅ Extract correct data from Strapi
        const data = resp?.data?.data?.attributes

        console.log("FORMATTED DATA 👉", data)

        // ✅ Fix null issues + structure
        setResumeInfo({
          ...data,
          experience: data?.experience || [],
          education: data?.education || [],
          skills: data?.skills || []
        })
      })
      .catch((error) => {
        console.log("ERROR 👉", error)
      })
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      {resumeInfo ? (
        <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
          <FormSection />
          <ResumePreview />
        </div>
      ) : (
        <p className='text-center mt-10'>Loading...</p>
      )}
    </ResumeInfoContext.Provider>
  )
}

export default EditResume