import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function Education({ enabledNext }) {

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()
  const [loading, setLoading] = useState(false)

  const [educationalList, setEducationalList] = useState([
    {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ])

  // ✅ Load data ONLY once safely
  useEffect(() => {
    if (
      resumeInfo?.education &&
      Array.isArray(resumeInfo.education) &&
      resumeInfo.education.length > 0
    ) {
      setEducationalList(resumeInfo.education)
    }
  }, [])

  // ✅ Handle input change (NO override issue)
  const handleChange = (e, index) => {
    enabledNext(false)

    const { name, value } = e.target

    setEducationalList(prev => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [name]: value
      }
      return updated
    })
  }

  //  Add new education
  const AddNewEducation = () => {
    setEducationalList(prev => [
      ...prev,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ])
  }

  //  Remove  education
  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList(prev => prev.slice(0, -1))
    }
  }

  //  Save data
  const onSave = () => {
    setLoading(true)

    const data = {
      data: {
        education: educationalList.map(({ id, ...rest }) => rest)
      }
    }

    GlobalApi.UpdateResumeDetail(params.resumeId, data)
      .then(() => {
        //  update context ONLY here
        setResumeInfo(prev => ({
          ...prev,
          education: educationalList
        }))

        enabledNext(true)
        setLoading(false)
        toast('Details updated!')
      })
      .catch(() => {
        setLoading(false)
        toast('Server Error')
      })
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      {educationalList.map((item, index) => (
        <div
          key={index}
          className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'
        >
          <div className='col-span-2'>
            <label>University Name</label>
            <Input
              name="universityName"
              value={item.universityName || ''}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div>
            <label>Degree</label>
            <Input
              name="degree"
              value={item.degree || ''}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div>
            <label>Major</label>
            <Input
              name="major"
              value={item.major || ''}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div>
            <label>Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate || ''}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div>
            <label>End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate || ''}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div className='col-span-2'>
            <label>Description</label>
            <Textarea
              name="description"
              value={item.description || ''}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
      ))}

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewEducation}>
            + Add More Education
          </Button>

          <Button variant="outline" onClick={RemoveEducation}>
            - Remove
          </Button>
        </div>

        <Button onClick={onSave} disabled={loading}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Education