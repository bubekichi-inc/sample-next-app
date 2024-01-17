'use client'

import { useEffect, useState } from 'react'
import classes from '../../../styles/Detail.module.scss'
import { Post } from '@/types/Post'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'

export default function Page() {
  // react-routerのuseParamsを使うと、URLのパラメータを取得できます。
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      const res = await fetch(`/api/posts/${id}`)
      const { post } = await res.json()
      setPost(post)
      setLoading(false)
    }

    fetcher()
  }, [id])

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!post?.thumbnailImageKey) return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(post.thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [post?.thumbnailImageKey])

  // 記事取得中は、読み込み中であることを表示します。
  if (loading) {
    return <div>読み込み中...</div>
  }

  // 記事が見つからなかった場合は、記事が見つからないことを表示します。
  if (!post) {
    return <div>記事が見つかりません</div>
  }

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        {thumbnailImageUrl && (
          <div className={classes.postImage}>
            <Image src={thumbnailImageUrl} alt="" height={1000} width={1000} />
          </div>
        )}
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={classes.postCategories}>
              {post.postCategories.map((postCategory) => {
                return (
                  <div
                    key={postCategory.category.id}
                    className={classes.postCategory}
                  >
                    {postCategory.category.name}
                  </div>
                )
              })}
            </div>
          </div>
          <div className={classes.postTitle}>{post.title}</div>
          <div
            className={classes.postBody}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  )
}
