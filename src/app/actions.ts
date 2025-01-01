'use server'

import prisma from "@/lib/db"


export async function getDocs() {
  return await prisma.documentation.findMany({
    include: { groups: true },
    orderBy: { order: 'asc' },
  })
}

export async function getDoc(id: number) {
  return await prisma.documentation.findUnique({
    where: { id },
    include: { groups: { orderBy: { order: 'asc' } } },
  })
}

export async function createDoc(data: { title: string, groups: { description: string, code: string }[] }) {
  const lastDoc = await prisma.documentation.findFirst({
    orderBy: { order: 'desc' },
  })
  const newOrder = lastDoc ? lastDoc.order + 1 : 0

  return await prisma.documentation.create({
    data: {
      title: data.title,
      order: newOrder,
      groups: {
        create: data.groups.map((group, index) => ({
          ...group,
          order: index,
        })),
      },
    },
    include: { groups: true },
  })
}

export async function updateDoc(id: number, data: { title: string, groups: { id?: number, description: string, code: string }[] }) {
  return await prisma.documentation.update({
    where: { id },
    data: {
      title: data.title,
      groups: {
        deleteMany: {},
        create: data.groups.map((group, index) => ({
          description: group.description,
          code: group.code,
          order: index,
        })),
      },
    },
    include: { groups: true },
  })
}

export async function deleteDoc(id: number) {
  await prisma.documentation.delete({
    where: { id },
  })
}

export async function reorderDocs(items: { id: number, order: number }[]) {
  const updates = items.map(item =>
    prisma.documentation.update({
      where: { id: item.id },
      data: { order: item.order },
    })
  )
  await prisma.$transaction(updates)
}

