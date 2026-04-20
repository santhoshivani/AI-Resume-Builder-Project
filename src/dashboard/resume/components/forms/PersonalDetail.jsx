import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function PersonalDetail({ enabledNext }) {
  const params = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  // ✅ Initialize form data from resumeInfo
  useEffect(() => {
    if (resumeInfo) {
      setFormData(resumeInfo)
    }
  }, [resumeInfo])

  // ✅ Enable Next automatically when form is valid
  useEffect(() => {
    if (
      formData?.firstName &&
      formData?.lastName &&
      formData?.jobTitle &&
      formData?.address &&
      formData?.phone &&
      formData?.email
    ) {
      enabledNext(true)
    } else {
      enabledNext(false)
    }
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    const updatedData = {
      ...formData,
      [name]: value
    }

    setFormData(updatedData)
    setResumeInfo({
      ...resumeInfo,
      [name]: value
    })
  }

  const onSave = (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      data: formData
    }

    GlobalApi.UpdateResumeDetail(params?.resumeId, data)
      .then((resp) => {
        console.log(resp)
        setLoading(false)
        toast("Details updated")
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className='grid grid-cols-2 mt-5 gap-3'>

          {/* First Name */}
          <div>
            <label className='text-sm'>First Name</label>
            <Input
              name="firstName"
              value={formData?.firstName || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className='text-sm'>Last Name</label>
            <Input
              name="lastName"
              value={formData?.lastName || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Job Title */}
          <div className='col-span-2'>
            <label className='text-sm'>Job Title</label>
            <Input
              name="jobTitle"
              value={formData?.jobTitle || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Address */}
          <div className='col-span-2'>
            <label className='text-sm'>Address</label>
            <Input
              name="address"
              value={formData?.address || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className='text-sm'>Phone</label>
            <Input
              name="phone"
              value={formData?.phone || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className='text-sm'>Email</label>
            <Input
              name="email"
              value={formData?.email || ""}
              onChange={handleInputChange}
            />
          </div>

        </div>

        {/* Save Button */}
        <div className='mt-3 flex justify-end'>
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PersonalDetail