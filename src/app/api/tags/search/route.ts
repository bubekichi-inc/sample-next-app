import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// タグ検索
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ status: 'OK', tags: [] }, { status: 200 })
    }

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 10, // 最大10件に制限
    })

    return NextResponse.json({ status: 'OK', tags }, { status: 200 })
  } catch (error) {
    console.error('タグ検索エラー:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { status: 'error', message: '内部サーバーエラー' },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
