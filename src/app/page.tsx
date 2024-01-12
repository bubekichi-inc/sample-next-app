'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import classes from '../styles/Home.module.scss'
import { Post } from '@/types/Post'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('api/posts')
      const { posts } = await res.json()
      setPosts(posts)
    }

    fetcher()
  }, [])

  return (
    <div className="">
      <div className={classes.container}>
        <ul>
          {/* 記事の一覧をmap処理で繰り返し表示します。*/}
          {posts.map((post) => {
            return (
              <li key={post.id} className={classes.list}>
                <Link href={`/posts/${post.id}`} className={classes.link}>
                  <div className={classes.post}>
                    <div className={classes.postContent}>
                      <div className={classes.postInfo}>
                        <div className={classes.postDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className={classes.postCategories}>
                          {post.postCategories.map((pc) => {
                            return (
                              <div
                                key={pc.category.id}
                                className={classes.postCategory}
                              >
                                {pc.category.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <p className={classes.postTitle}>{post.title}</p>
                      <div
                        className={classes.postBody}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
