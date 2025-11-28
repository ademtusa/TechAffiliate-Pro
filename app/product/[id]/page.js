'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

// Bu sayfa artık kullanılmıyor. Tüm ürünler /sales/[id] sayfasına yönlendiriliyor.
export default function ProductRedirect() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params?.id) {
      // Otomatik olarak yeni sales sayfasına yönlendir
      router.replace(`/sales/${params.id}`)
    }
  }, [params, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Yönlendiriliyorsunuz...</p>
      </div>
    </div>
  )
}
