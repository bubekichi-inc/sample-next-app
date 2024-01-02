import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* サイドバー */}
      <aside className="fixed bg-gray-100 w-[280px] left-0 bottom-0 top-[72px]">
        <Link href="/admin/posts" className="p-4 block hover:bg-blue-100">
          記事一覧
        </Link>
        <Link href="/admin/categories" className="p-4 block hover:bg-blue-100">
          カテゴリー一覧
        </Link>
      </aside>

      {/* メインエリア */}
      <div className="ml-[280px] p-4">{children}</div>
    </>
  )
}