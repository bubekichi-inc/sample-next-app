'use client'

import { API_BASE_URL } from '@/constants'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import classes from '../styles/Home.module.scss'
import { MicroCmsPost, Post } from '@/types/post'

export default function Home() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('https://2gzszlwapo.microcms.io/api/v1/posts', {
        headers: {
          'X-MICROCMS-API-KEY': process.env
            .NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      })
      const { contents } = await res.json()
      setPosts(contents)
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
                          {post.categories.map((category) => {
                            return (
                              <div
                                key={category.id}
                                className={classes.postCategory}
                              >
                                {category.name}
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
