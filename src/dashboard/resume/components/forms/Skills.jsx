import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function Skills({ enabledNext }) {

  const [skillsList, setSkillsList] = useState([
    { name: '', rating: 0 }
  ])

  const { resumeId } = useParams()
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

  // LOAD DATA 
  useEffect(() => {
    if (Array.isArray(resumeInfo?.skills)) {
      setSkillsList(resumeInfo.skills)
    } else {
      setSkillsList([{ name: '', rating: 0 }])
    }
  }, [resumeInfo])

  //  HANDLE CHANGE (NO CRASH, NO LOOP)
  const handleChange = (index, name, value) => {
    enabledNext && enabledNext(false)

    const updated = [...skillsList]
    updated[index] = {
      ...updated[index],
      [name]: value
    }

    setSkillsList(updated)

    //  update preview 
    setResumeInfo(prev => ({
      ...prev,
      skills: updated
    }))
  }

  //  ADD SKILL
  const AddNewSkills = () => {
    const updated = [...skillsList, { name: '', rating: 0 }]
    setSkillsList(updated)

    enabledNext && enabledNext(false)

    setResumeInfo(prev => ({
      ...prev,
      skills: updated
    }))
  }

  //
  const RemoveSkills = () => {
    if (skillsList.length > 1) {
      const updated = skillsList.slice(0, -1)
      setSkillsList(updated)

      enabledNext && enabledNext(false)

      setResumeInfo(prev => ({
        ...prev,
        skills: updated
      }))
    }
  }

  // SAVE DATA
  const onSave = () => {
    setLoading(true)

    const cleanedData = skillsList.map(({ id, ...rest }) => ({
      name: rest.name || '',
      rating: rest.rating || 0
    }))

    const data = {
      data: {
        skills: cleanedData
      }
    }

    GlobalApi.UpdateResumeDetail(resumeId, data).then(
      () => {
        enabledNext && enabledNext(true)
        setLoading(false)
        toast('Details updated!')
      },
      () => {
        setLoading(false)
        toast('Server Error, Try again!')
      }
    )
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p>Add Your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className='flex justify-between mb-2 border rounded-lg p-3'
          >
            <div className='w-full mr-4'>
              <label className='text-xs'>Name</label>
              <Input
                className='w-full'
                value={item.name || ''}
                onChange={(e) =>
                  handleChange(index, 'name', e.target.value)
                }
              />
            </div>

            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating || 0}
              onChange={(v) =>
                handleChange(index, 'rating', v)
              }
            />
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewSkills}>
            + Add More Skill
          </Button>

          <Button variant="outline" onClick={RemoveSkills}>
            - Remove
          </Button>
        </div>

        <Button disabled={loading} onClick={onSave}>
          {loading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  )
}

export default Skills