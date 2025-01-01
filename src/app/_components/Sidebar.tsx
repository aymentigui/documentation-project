'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'
import { getDocs, reorderDocs } from '@/app/actions'

type Documentation = {
  id: number
  title: string
  order: number
}

export default function Sidebar() {
  const [docs, setDocs] = useState<Documentation[]>([])
  const pathname = usePathname()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    const data = await getDocs()
    setDocs(data)
  }

  const handleDragEnd = async (event: any) => {
    const {active, over} = event

    if (active.id !== over.id) {
      setDocs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Update order in the database
        reorderDocs(newItems.map((item, index) => ({ id: item.id, order: index })))

        return newItems
      })
    }
  }

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <Link href={"/"}><h2 className="text-xl font-bold mb-4">Documentation</h2></Link>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={docs.map(doc => doc.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {docs.map((doc) => (
              <SortableItem key={doc.id} id={doc.id}>
                <li
                  className={`mb-2 p-2 rounded ${
                    pathname === `/doc/${doc.id}` ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <Link href={`/doc/${doc.id}`}>{doc.title}</Link>
                </li>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}

