'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getDoc, deleteDoc } from '@/app/actions'
import { Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type Group = {
  id: number
  description: string
  code: string
}

type Documentation = {
  id: number
  title: string
  groups: Group[]
}

export default function DocPage() {
  const [doc, setDoc] = useState<Documentation | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()

  useEffect(() => {
    fetchDoc()
    // @ts-ignore
  }, [params.id])

  const fetchDoc = async () => {
    // @ts-ignore
    const data = await getDoc(parseInt(params.id))
    setDoc(data)
  }

  const handleDelete = async () => {
    // @ts-ignore
    await deleteDoc(parseInt(params.id))
    router.push('/')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Code copié !",
        description: "Le code a été copié dans le presse-papier.",
        duration: 3000,
      })
    }, (err) => {
      console.error('Erreur lors de la copie du code: ', err)
      toast({
        title: "Erreur",
        description: "Impossible de copier le code. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      })
    })
  }

  if (!doc) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{doc.title}</h1>
      <Accordion type="single" collapsible className="w-full">
        {doc.groups.map((group, index) => (
          <AccordionItem key={group.id} value={`item-${index}`}>
            <AccordionTrigger><pre>{group.description}</pre></AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(group.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                    {group.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="space-x-4">
        <Button onClick={() => router.push(`/edit/${doc.id}`)}>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  )
}

