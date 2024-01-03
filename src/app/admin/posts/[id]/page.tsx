'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/types/post'
import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Post['categories']>([])
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    // 記事を作成します。
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, thumbnailUrl, categories }),
    })

    alert('記事を更新しました。')
  }

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return

    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    })

    alert('記事を削除しました。')

    router.push('/admin/posts')
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`)
      const { post } = await res.json()
      setTitle(post.title)
      setContent(post.content)
      setThumbnailUrl(post.thumbnailUrl)
      setCategories(post.categories)
    }

    fetcher()
  }, [id])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  )
}
