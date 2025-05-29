import { NextRequest, NextResponse } from 'next/server'
import { Category, PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/utils/supabase'

const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  const { id } = params

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        postTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// 記事の更新時に送られてくるリクエストのbodyの型
interface UpdatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  tags: { id: number }[]
  thumbnailImageKey: string
}

// PUTという命名にすることで、PUTリクエストの時にこの関数が呼ばれる
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  // リクエストのbodyを取得
  const {
    title,
    content,
    categories,
    tags,
    thumbnailImageKey,
  }: UpdatePostRequestBody = await request.json()

  try {
    // idを指定して、Postを更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      })
    }

    // 一旦、記事とタグの中間テーブルのレコードを全て削除
    await prisma.postTag.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    // 記事とタグの中間テーブルのレコードをDBに生成
    for (const tag of tags) {
      await prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      })
    }

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// DELETEという命名にすることで、DELETEリクエストの時にこの関数が呼ばれる
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try {
    // idを指定して、Postを削除
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
