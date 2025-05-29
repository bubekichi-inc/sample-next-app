'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/types/Category'
import { Tag } from '@/types/Tag'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { Post } from '@/types/post'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    // 記事を作成します。
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        thumbnailImageKey,
        categories,
        tags,
      }),
    })

    alert('記事を更新しました。')
  }

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return

    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
    })

    alert('記事を削除しました。')

    router.push('/admin/posts')
  }

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      const { post }: { post: Post } = await res.json()
      setTitle(post.title)
      setContent(post.content)
      setThumbnailImageKey(post.thumbnailImageKey)
      setCategories(post.postCategories.map((pc) => pc.category))
      setTags(post.postTags.map((pt) => pt.tag))
    }

    fetcher()
  }, [id, token])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        tags={tags}
        setTags={setTags}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  )
}
