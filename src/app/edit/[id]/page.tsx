'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from 'lucide-react'
import { getDoc, updateDoc } from '@/app/actions'

type Group = {
  id?: number
  description: string
  code: string
}

type Documentation = {
  id: number
  title: string
  groups: Group[]
}

export default function EditDoc() {
  const [doc, setDoc] = useState<Documentation | null>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetchDoc()
  }, [params.id])

  const fetchDoc = async () => {
    // @ts-ignore
    const data = await getDoc(parseInt(params.id))
    setDoc(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doc) return

    await updateDoc(doc.id, doc)
    router.push(`/doc/${doc.id}`)
  }

  const addGroup = () => {
    if (doc) {
      setDoc({
        ...doc,
        groups: [...doc.groups, { description: '', code: '' }]
      })
    }
  }

  const removeGroup = (index: number) => {
    if (doc) {
      setDoc({
        ...doc,
        groups: doc.groups.filter((_, i) => i !== index)
      })
    }
  }

  const updateGroup = (index: number, field: 'description' | 'code', value: string) => {
    if (doc) {
      const newGroups = [...doc.groups]
      newGroups[index][field] = value
      setDoc({
        ...doc,
        groups: newGroups
      })
    }
  }

  if (!doc) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="text"
        value={doc.title}
        onChange={(e) => setDoc({ ...doc, title: e.target.value })}
        placeholder="Title"
        required
      />
      {doc.groups.map((group, index) => (
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
      <Button type="submit">Update Documentation</Button>
    </form>
  )
}

