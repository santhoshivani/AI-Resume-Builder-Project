import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle, Brain } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

//   AI 
import { AIChatSession } from "../../../../../service/AIModel";

const formField = {
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  summery: '',
}

function Experience({ enabledNext }) {

  const [experienceList, setExperienceList] = useState([{ ...formField }])
  const [aiSummaryList, setAiSummaryList] = useState({})
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (resumeInfo?.experience?.length > 0) {
      setExperienceList(resumeInfo.experience)
    }
  }, [resumeInfo])

  const handleChange = (index, event) => {
    const { name, value } = event.target

    setExperienceList(prev => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [name]: value || ''
      }
      return updated
    })

    enabledNext(false)
  }

  const handleRichTextEditor = (value, name, index) => {
    setExperienceList(prev => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [name]: value || ''
      }
      return updated
    })

    enabledNext(false)
  }

  const addNewExperience = () => {
    setExperienceList(prev => [...prev, { ...formField }])
  }

  const removeExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList(prev => prev.slice(0, -1))
    }
  }

  // FIXED AI FUNCTION
  const GenerateSummaryAI = async (index) => {

    const exp = experienceList[index]

    //  VALIDATION
    if (!exp.title || exp.title.trim() === "") {
      toast("Please enter Position Title")
      return
    }

    setLoading(true)

    const PROMPT = `
    Job Title: ${exp.title}
    Company: ${exp.companyName || "Tech Company"}

    Generate 3 professional resume experience summaries.

    Rules:
    - Each summary should be 2-3 lines only
    - Do NOT add headings like Option 1
    - Do NOT add explanations
    - Only clean resume sentences
    - Focus on skills, technologies, and impact
    `

    try {
      const result = await AIChatSession.sendMessage(PROMPT)

      const text = result.response.text()

      console.log("AI CLEAN 👉", text)

      const suggestions = text
        .split("\n")
        .map(s => s.replace(/^[-•\d.*]+/, "").trim())
        .filter(s => s.length > 20)

      setAiSummaryList(prev => ({
        ...prev,
        [index]: suggestions.map(s => ({ summary: s }))
      }))

    } catch (error) {
      console.log("AI ERROR:", error)
      toast("AI generation failed")
    }

    setLoading(false)
  }

  const onSave = () => {
    setLoading(true)

    const hasEmptyTitle = experienceList.some(
      item => !item.title || item.title.trim() === ""
    )

    if (hasEmptyTitle) {
      toast("Please Add Position Title")
      setLoading(false)
      return
    }

    const data = {
      data: { experience: experienceList },
    }

    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(() => {
      setResumeInfo(prev => ({ ...prev, experience: experienceList }))
      enabledNext(true)
      setLoading(false)
      toast("Saved successfully")
    })
  }

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>

        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add your previous job experience</p>

        {experienceList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>

            <Input name='title' value={item.title || ''} onChange={(e) => handleChange(index, e)} placeholder="Position Title" />
            <Input name='companyName' value={item.companyName || ''} onChange={(e) => handleChange(index, e)} placeholder="Company" />
            <Input name='city' value={item.city || ''} onChange={(e) => handleChange(index, e)} placeholder="City" />
            <Input name='state' value={item.state || ''} onChange={(e) => handleChange(index, e)} placeholder="State" />
            <Input type='date' name='startDate' value={item.startDate || ''} onChange={(e) => handleChange(index, e)} />
            <Input type='date' name='endDate' value={item.endDate || ''} onChange={(e) => handleChange(index, e)} />

            <div className='col-span-2'>

              {/* AI BUTTON */}
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => GenerateSummaryAI(index)}
                  className="border-primary text-primary flex gap-2"
                >
                  {loading ? <LoaderCircle className="animate-spin h-4 w-4" /> : <Brain className="h-4 w-4" />}
                  Generate from AI
                </Button>
              </div>

              {/* TEXT EDITOR */}
              <Textarea
  placeholder="Enter job summary"
  value={item.summery || ""}
  onChange={(e) =>
    handleRichTextEditor(e.target.value, 'summery', index)
  }
  className="mt-2"
/>
              {/*  SUGGESTIONS */}
              {aiSummaryList[index]?.length > 0 && (
                <div className="mt-4">
                  <h2 className="font-bold">Suggestions</h2>

                  {aiSummaryList[index].map((sug, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        handleRichTextEditor(sug.summary, 'summery', index)
                      }
                      className="p-4 border rounded-lg my-2 cursor-pointer hover:bg-gray-100"
                    >
                      {sug.summary}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        ))}

        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={addNewExperience}>+ Add</Button>
            <Button variant='outline' onClick={removeExperience}>- Remove</Button>
          </div>

          <Button onClick={onSave} disabled={loading}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>

      </div>
    </div>
  )
}

export default Experience