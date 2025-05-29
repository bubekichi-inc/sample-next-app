import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 新しいタグを作成
export const POST = async (request: NextRequest) => {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'タグ名が必要です' },
        { status: 400 },
      )
    }

    const trimmedName = name.trim()

    // 既存タグのチェック
    const existingTag = await prisma.tag.findUnique({
      where: { name: trimmedName },
    })

    if (existingTag) {
      return NextResponse.json(
        { status: 'OK', tag: existingTag },
        { status: 200 },
      )
    }

    // 新しいタグを作成
    const newTag = await prisma.tag.create({
      data: { name: trimmedName },
    })

    return NextResponse.json({ status: 'OK', tag: newTag }, { status: 201 })
  } catch (error) {
    console.error('タグ作成エラー:', error)
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
