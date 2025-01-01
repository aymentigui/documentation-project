'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from 'lucide-react'
import { createDoc } from '@/app/actions'

type Group = {
  description: string
  code: string
}

export default function CreateDoc() {
  const [title, setTitle] = useState('')
  const [groups, setGroups] = useState<Group[]>([{ description: '', code: '' }])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDoc({ title, groups })
    router.push('/')
  }

  const addGroup = () => {
    setGroups([...groups, { description: '', code: '' }])
  }

  const removeGroup = (index: number) => {
    setGroups(groups.filter((_, i) => i !== index))
  }

  const updateGroup = (index: number, field: keyof Group, value: string) => {
    const newGroups = [...groups]
    newGroups[index][field] = value
    setGroups(newGroups)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      {groups.map((group, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <Textarea
            value={group.description}
            onChange={(e) => updateGroup(index, 'description', e.target.value)}
            placeholder="Description"
            required
          />
          <Textarea
            value={group.code}
            onChange={(e) => updateGroup(index, 'code', e.target.value)}
            placeholder="Code"
            required
            className="font-mono"
          />
          <Button type="button" variant="destructive" onClick={() => removeGroup(index)}>
            <Trash className="mr-2 h-4 w-4" /> Remove Group
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addGroup} variant="outline">
        <Plus className="mr-2 h-4 w-4" /> Add Group
      </Button>
      <Button type="submit">Save Documentation</Button>
    </form>
  )
}

