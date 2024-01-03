import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const POST = async (request: Request, context: any) => {
  try {
    const body = await request.json()

    const { title, content, categories, thumbnailUrl } = body

    const data = await prisma.post.create({
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

    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}
