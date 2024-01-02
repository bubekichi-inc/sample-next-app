import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export const POST = async (request: Request, context: any) => {
  try {
    const body = await request.json()

    const { title, content, categories, thumbnailUrl } = body

    await prisma.post.create({
      data: {
        title,
        content,
        categories: {
          connect: categories.map((category: string) => ({
            name: category,
          })),
        },
        thumbnailUrl,
      },
    })

    return NextResponse.json({ status: 'OK', message: '作成しました' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}
