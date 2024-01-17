import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

/** APIリクエストのtokenの検証。検証できればログインユーザー（Supabase）情報を返す */
export const getCurrentUser = async (request: NextRequest) => {
  const token = request.headers.get('Authorization')!
  const { data, error } = await supabase.auth.getUser(token)

  return { currentUser: data, error }
}

// 画像のアップロード先のバケット名(Supabaseの管理画面で設定した名前)
export const THUMBNAIL_IMAGE_BUCKET_NAME = 'post_thumbnail'
