'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import confetti from 'canvas-confetti'

export default function Guestbook() {
  const [lang, setLang] = useState('en') // 'en' or 'ar'
  const [signature, setSignature] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('image')
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isAr = lang === 'ar'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!signature || !message) {
      return alert(isAr ? 'يا ريت تكتبوا الرسالة والتوقيع' : 'Please leave your message and signature.')
    }

    setUploading(true)
    let mediaUrl = null

    try {
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('guestbook-media')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('guestbook-media')
          .getPublicUrl(fileName)

        mediaUrl = publicUrlData.publicUrl
      }

      const { error: dbError } = await supabase
        .from('wishes')
        .insert([{ guest_name: signature, message, media_url: mediaUrl, media_type: file ? fileType : null }])

      if (dbError) throw dbError

      setSubmitted(true)
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#b59351', '#d4af37', '#fdfbf7']
      })
    } catch (error) {
      console.error(error)
      alert(isAr ? 'حصل مشكلة بسيطة، حاولوا تبعتوا تاني' : 'An error occurred. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#eee7dd] flex items-center justify-center p-0 md:p-4 font-serif">
      
      {/* Mobile Frame Container */}
      <div className="relative w-full max-w-[420px] h-[100dvh] md:h-[860px] bg-[#fbf9f5] md:rounded-[40px] shadow-2xl overflow-hidden border-0 md:border-[6px] md:border-[#383022]/10 flex flex-col justify-between p-4 pt-12">
        
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>

        {/* Top Content Area */}
        <div className="relative z-10 w-full space-y-2 pt-6">
          
          {/* Header Area */}
          <div className="text-center space-y-1">
            
            {/* Tag line fixed in English */}
            <div className="inline-block px-3 py-0.5 rounded-full bg-[#fbf9f5]/80 backdrop-blur-md border border-[#e5d5be]/60 shadow-sm">
              <p className="text-[9px] tracking-widest uppercase text-[#7d6332] font-sans font-semibold">
                Digital Guestbook
              </p>
            </div>

            {/* PNG Names Logo */}
            <div className="flex justify-center items-center py-0.5">
              <img 
                src="/names.png" 
                alt="Bishoy & Easter" 
                className="h-14 md:h-16 object-contain drop-shadow-sm" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'block';
                }}
              />
              <h1 className="hidden text-2xl font-serif text-[#5c461e]">
                Bishoy & Easter
              </h1>
            </div>

            {/* Clean Sans-Serif Subtitle */}
            <p className="text-[10px] text-[#4d3f28] font-sans font-medium tracking-wide drop-shadow-sm">
              {isAr 
                ? 'شاركونا كلمة حلوة أو فيديو سيلفي يفضل ذكراكم معانا' 
                : 'Leave us a sweet message or a selfie video to remember this day.'}
            </p>
          </div>

          {/* Semi-Transparent Glass Form Card */}
          {submitted ? (
            <div className="bg-[#fcfaf7]/65 backdrop-blur-md border border-[#e8dac8]/80 rounded-2xl p-5 text-center space-y-2.5 shadow-lg">
              <h2 className="text-lg font-serif text-[#7d6332]">
                {isAr ? 'نورتونا وفرحتونا' : 'Thank You!'}
              </h2>
              <p className="text-[11px] text-[#4a3d28] font-sans font-normal leading-relaxed">
                {isAr 
                  ? 'كلماتكم وصلت لنا ب كل حب وهتفضل ذكرى غالية علينا جداً شكراً إنكم شاركتونا فرحتنا انهارده' 
                  : 'Your sweet words have been received with love. Thank you for celebrating this day with us!'}
              </p>
            </div>
          ) : (
            <div className="bg-[#fcfaf7]/60 backdrop-blur-md border border-[#e8dac8]/80 rounded-2xl p-3.5 shadow-lg space-y-2">
              <form 
                onSubmit={handleSubmit} 
                className={`space-y-2 font-sans ${isAr ? 'text-right dir-rtl' : 'text-left'}`}
              >
                
                {/* Note Area */}
                <div>
                  <label className="block text-[9.5px] font-serif text-[#4a3b25] mb-0.5 font-medium">
                    {isAr ? 'هنحب نشوف رسالتكم لينا بعد الفرح ' : 'Your Note for Us'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={isAr ? 'سيبوا لنا كلمة أو ذكرى حلوة هنا...' : 'Write your wishes, blessings, or a warm note here...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#fffefc]/75 backdrop-blur-sm border border-[#e3d3c1]/90 focus:border-[#a88a50] rounded-lg p-2 text-[11px] focus:outline-none transition text-[#383022] placeholder-[#8c7f6d] resize-none shadow-inner"
                  />
                </div>

                {/* Signature Box */}
                <div>
                  <label className="block text-[9.5px] font-serif text-[#4a3b25] mb-0.5 font-medium">
                    {isAr ? 'التوقيع' : 'Signed with love by'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'اسمكم أو توقيعكم...' : 'Your signature or name...'}
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full bg-[#fffefc]/75 backdrop-blur-sm border border-[#e3d3c1]/90 focus:border-[#a88a50] rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none transition text-[#383022] placeholder-[#8c7f6d] shadow-inner font-serif italic"
                  />
                </div>

                {/* Media Attachment */}
                <div className="space-y-1">
                  <label className="block text-[9.5px] font-serif text-[#4a3b25] font-medium">
                    {isAr ? 'صورة سيلفي (اختياري)' : 'Optional Memory'}
                  </label>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center justify-center py-1.5 px-2 bg-[#f7f2ea]/75 hover:bg-[#efe7db] border border-[#e0d0bc]/90 rounded-lg cursor-pointer transition text-[#4a3b25] text-[9.5px] font-medium backdrop-blur-sm">
                      <span>{isAr ? 'فيديو سيلفي' : 'Selfie Video'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        capture="user"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setFile(e.target.files[0])
                            setFileType('video')
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <label className="flex items-center justify-center py-1.5 px-2 bg-[#f7f2ea]/75 hover:bg-[#efe7db] border border-[#e0d0bc]/90 rounded-lg cursor-pointer transition text-[#4a3b25] text-[9.5px] font-medium backdrop-blur-sm">
                      <span>{isAr ? 'صورة سيلفي' : 'Take Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setFile(e.target.files[0])
                            setFileType('image')
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {file && (
                    <p className="text-[8.5px] text-[#7d6332] text-center italic mt-0.5 font-medium">
                      {isAr ? 'تم : ' : 'Attached: '}{file.name.substring(0, 18)}...
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full mt-1 bg-[#7d6332]/90 hover:bg-[#695228] active:scale-[0.99] text-[#fffdfa] font-serif py-2 rounded-lg text-[11px] tracking-wider transition-all shadow-md disabled:opacity-50"
                >
                  {uploading 
                    ? (isAr ? 'جاري الإرسال...' : 'Sending Wishes...') 
                    : (isAr ? 'أرسل ' : 'Send Wishes')}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Floating Language Switcher Button */}
        <div className="relative z-20 flex justify-end pb-1 pt-2">
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="px-3 py-1 bg-[#fbf9f5]/80 backdrop-blur-md border border-[#e5d5be] rounded-full text-[10px] font-sans font-semibold text-[#7d6332] shadow-sm hover:bg-[#fffefc] transition"
          >
            {isAr ? 'English' : 'عربي'}
          </button>
        </div>

      </div>
    </div>
  )
}