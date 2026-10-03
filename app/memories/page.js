'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Download } from 'lucide-react'

export default function MemoriesPage() {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setWishes(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#141416] text-gray-100 p-6 font-sans dir-rtl">
      <header className="max-w-5xl mx-auto mb-8 border-b border-gray-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#c5a059]">دفتر الذكريات الرقمي ✨</h1>
          <p className="text-xs text-gray-400">جميع رسائل وفيديوهات المعازيم</p>
        </div>
        <div className="bg-[#1f1f23] px-4 py-2 rounded-full text-xs text-[#c5a059] border border-[#2d2d33]">
          إجمالي الذكريات: {wishes.length}
        </div>
      </header>

      {loading ? (
        <p className="text-center text-gray-500 py-12">جاري تحميل الذكريات...</p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((item) => (
            <div key={item.id} className="bg-[#1f1f23] border border-[#2d2d33] rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-[#f3e5c8]">{item.guest_name}</h3>
                  <span className="text-[10px] text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{item.message}</p>
              </div>

              {item.media_url && (
                <div className="space-y-2 pt-2">
                  {item.media_type === 'video' ? (
                    <video src={item.media_url} controls className="w-full h-48 object-cover rounded-xl border border-gray-800" />
                  ) : (
                    <img src={item.media_url} alt="Selfie" className="w-full h-48 object-cover rounded-xl border border-gray-800" />
                  )}

                  <a
                    href={item.media_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#2a2a30] hover:bg-[#34343d] text-xs text-gray-200 py-2 rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>تحميل الملف</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}