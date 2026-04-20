import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Brain, LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg'
import { AIChatSession } from '../../../../service/AIModel'
import { toast } from 'sonner'

const PROMPT =
  'position title: {positionTitle}, give me 5-7 bullet points for resume in HTML format'

function RichTextEditor({ onRichTextEditorChange, index, value }) {
  const [editorValue, setEditorValue] = useState(value || '')
  const { resumeInfo } = useContext(ResumeInfoContext)
  const [loading, setLoading] = useState(false)

  // ✅ Sync value from parent
  useEffect(() => {
    setEditorValue(value || '')
  }, [value])

  // ✅ AI Generate
  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.Experience?.[index]?.title) {
      toast('Please Add Position Title')
      return
    }

    setLoading(true)

    try {
      const prompt = PROMPT.replace(
        '{positionTitle}',
        resumeInfo.Experience[index].title
      )

      const result = await AIChatSession.sendMessage(prompt)
      const resp = result.response.text()

      setEditorValue(resp)

      //  parent state 
      onRichTextEditorChange(resp)
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <div>
      {/* Header */}
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summary</label>

        <Button
          variant='outline'
          size='sm'
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className='flex gap-2 border-primary text-primary'
        >
          {loading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <>
              <Brain className='h-4 w-4' />
              Generate from AI
            </>
          )}
        </Button>
      </div>

      {/* Editor */}
      <EditorProvider>
        <Editor
          value={editorValue}
          onChange={(e) => {
            const val = e.target.value

            setEditorValue(val)

            // 🔥 MOST IMPORTANT FIX
            onRichTextEditorChange(val)
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}

export default RichTextEditor