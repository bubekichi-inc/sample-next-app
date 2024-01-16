import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useRouteGuard = () => {
  const router = useRouter()
  const { session } = useSupabaseSession()

  useEffect(() => {
    if (session === undefined) return

    const fetcher = async () => {
      if (!session) {
        router.replace('/login')
      }
    }

    fetcher()
  }, [router, session])
}
