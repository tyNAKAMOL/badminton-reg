export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-emerald-500">ABC Badminton Tournament 2025</h1>
        <p className="text-gray-700 text-lg">
          แข่งขันแบดมินตันประเภทคู่ครั้งยิ่งใหญ่ ชิงรางวัลและเสื้อที่ระลึก
        </p>
        <hr></hr>
        <ul className="text-gray-600 font-bold space-y-1 text-xl">
          <li>สถานที่: ทวิมุขแบดมินตัน รามคำแหง 36/1</li>
          <li>วันเสาร์ที่ 4 ตุลาคม 2568</li>
          <li>แข่งขัน 1 วันจบ (08:00 - 18:00 น.)</li>
        </ul>
        <img src="/images/ABC.png" alt="rules" width={600} className="mx-auto" />
        <a
          href="/register"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition pointer"
        >
          ลงทะเบียนเข้าร่วม
        </a>
      </div>
    </main>
  )
}
