import React, { useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import GlobalApi from '../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle, Brain } from 'lucide-react'

//  AI IMPORT AS SUMMARY
import { AIChatSession } from "../../../../../service/AIModel";

function Projects() {

  const [projects, setProjects] = useState([
    { title: '', description: '' }
  ])

  const [loadingIndex, setLoadingIndex] = useState(null)

  const { resumeId } = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

  useEffect(() => {
    if (Array.isArray(resumeInfo?.projects)) {
      setProjects(resumeInfo.projects)
    }
  }, [resumeInfo])

  const handleChange = (index, field, value) => {
    const updated = [...projects]
    updated[index][field] = value
    setProjects(updated)

    setResumeInfo(prev => ({
      ...prev,
      projects: updated
    }))
  }

  const addProject = () => {
    setProjects([...projects, { title: '', description: '' }])
  }

  const removeProject = () => {
    if (projects.length > 1) {
      setProjects(projects.slice(0, -1))
    }
  }

  // AI FUNCTION 
  const GenerateProjectAI = async (index) => {
    const project = projects[index]

    //  validation
    if (!project.title || project.title.trim() === "") {
      toast("Please enter project title")
      return
    }

    setLoadingIndex(index)

    const PROMPT = `
    Project Title: ${project.title}

    Write a professional resume project description (3-4 lines).
    Keep it concise and impactful.
    Include:
    - technologies
    - features
    - result/impact
    `

    try {
      const result = await AIChatSession.sendMessage(PROMPT)

      const text = result.response.text()

      console.log("PROJECT AI 👉", text)

      const updated = [...projects]
      updated[index].description = text

      setProjects(updated)

      setResumeInfo(prev => ({
        ...prev,
        projects: updated
      }))

    } catch (error) {
      console.log("AI ERROR:", error)
      toast("AI generation failed")
    }

    setLoadingIndex(null)
  }

  const onSave = () => {
    const data = {
      data: {
        projects
      }
    }

    GlobalApi.UpdateResumeDetail(resumeId, data).then(() => {
      toast("Projects updated!")
    })
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Projects</h2>

      {projects.map((item, index) => (
        <div key={index} className='mb-4 border p-3 rounded'>

          {/* TITLE */}
          <Input
            placeholder="Project Title"
            value={item.title || ''}
            onChange={(e) =>
              handleChange(index, 'title', e.target.value)
            }
          />

          {/* AI BUTTON */}
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => GenerateProjectAI(index)}
              disabled={loadingIndex === index}
              className="border-primary text-primary flex gap-2"
            >
              {loadingIndex === index ? (
                <LoaderCircle className="animate-spin h-4 w-4" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              Generate from AI
            </Button>
          </div>

          {/* DESCRIPTION */}
          <Input
            placeholder="Project Description"
            value={item.description || ''}
            onChange={(e) =>
              handleChange(index, 'description', e.target.value)
            }
            className="mt-2"
          />

        </div>
      ))}

      <div className='flex gap-2'>
        <Button onClick={addProject}>+ Add</Button>
        <Button onClick={removeProject}>- Remove</Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}

export default Projects