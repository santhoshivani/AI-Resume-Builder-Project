import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LoaderCircle, Brain } from 'lucide-react'
import { toast } from 'sonner'
import GlobalApi from './../../../../../service/GlobalApi'

// ✅ FIXED IMPORT (based on your folder)
import { AIChatSession } from "../../../../../service/AIModel";

const promptTemplate = `
Job Title: {jobTitle}

Write a professional resume summary (3-4 lines).
Keep it concise, impactful, and suitable for a resume.
`

function Summery({ enabledNext }) {

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [summery, setSummery] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([])
  const params = useParams()

  //  Sync with context
  useEffect(() => {
    if (summery) {
      setResumeInfo(prev => ({
        ...prev,
        summery: summery
      }))
    }
  }, [summery])

  //  GEMINI AI FUNCTION (FINAL)
  const GenerateSummeryFromAI = async () => {
    console.log("API KEY 👉", import.meta.env.VITE_GOOGLE_AI_API_KEY)
    setLoading(true)

    const PROMPT = promptTemplate.replace(
      '{jobTitle}',
      resumeInfo?.jobTitle || 'Software Developer'
    )

    try {
      const result = await AIChatSession.sendMessage(PROMPT)

      const text = result.response.text()

      console.log("GEMINI RESULT 👉", text)

      setAiGenerateSummeryList([
        {
          experience_level: "Generated",
          summery: text,
        },
      ])

    } catch (error) {
      console.log("AI ERROR:", error)
      toast("AI generation failed")
    }

    setLoading(false)
  }

  // ✅ Save
  const onSave = (e) => {
    e.preventDefault()

    setLoading(true)

    const data = {
      data: {
        summery: summery
      }
    }

    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(
      () => {
        enabledNext && enabledNext(true)
        setLoading(false)
        toast("Details updated")
      },
      () => {
        setLoading(false)
        toast("Server Error")
      }
    )
  }

  return (
    <div>

      {/* FORM */}
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>

            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Brain className='h-4 w-4' />
              Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            value={summery || resumeInfo?.summery || ""}
            onChange={(e) => setSummery(e.target.value)}
          />

          <div className='mt-2 flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading
                ? <LoaderCircle className='animate-spin' />
                : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {/* AI SUGGESTIONS */}
      {aiGeneratedSummeryList?.length > 0 && (
        <div className='my-5'>
          <h2 className='font-bold text-lg'>Suggestions</h2>

          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummery(item?.summery)}
              className='p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-100'
            >
              <h2 className='font-bold my-1 text-primary'>
                Level: {item?.experience_level}
              </h2>

              <p>{item?.summery}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Summery