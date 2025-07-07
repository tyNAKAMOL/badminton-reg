'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    teamName: '',
    category: '',
    player1: {
      firstName: '',
      lastName: '',
      gender: '',
      email:'',
      age: '',
      phone: '',
      lineId: '',
      shirtSize: '',
      shirtText: ''
    },
    player2: {
      firstName: '',
      lastName: '',
      gender: '',
      email:'',
      age: '',
      phone: '',
      lineId: '',
      shirtSize: '',
      shirtText: ''
    }
  })

  const [message, setMessage] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    player?: 'player1' | 'player2'
  ) {
  
    const { name, value } = e.target
    if (player === 'player1' || player === 'player2') {
        setForm((prev) => ({
          ...prev,
          [player]: {
            ...prev[player],
            [name]: value
          }
        }))
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: value
        }))
      }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('✅ ลงทะเบียนสำเร็จ')
      setForm({
        teamName: '',
        category: '',
        player1: {
          firstName: '',
          lastName: '',
          gender: '',
          age: '',
          email:'',
          phone: '',
          lineId: '',
          shirtSize: '',
          shirtText: ''
        },
        player2: {
          firstName: '',
          lastName: '',
          gender: '',
          age: '',
          email:'',
          phone: '',
          lineId: '',
          shirtSize: '',
          shirtText: ''
        }
      })
    } else {
      setMessage(`❌ ${data.error}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full space-y-6"
      >
        <h1 className="text-3xl font-bold text-center  text-emerald-600">
          ลงทะเบียนแข่งขันแบดมินตัน
        </h1>
        <img src="/images/rules.png" alt="rules"  />
        <img src="/images/rack.png" alt="rack"  />
        <img src="/images/shirt.png" alt="shirt"  />
        <hr />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อทีม</label>
            <input
              className="mt-1 border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
              name="teamName"
              value={form.teamName}
              onChange={handleChange}
              placeholder="เช่น ทีมสายฟ้า"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ประเภททีม</label>
            <select
              className="mt-1 border rounded p-2 w-full"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">เลือกประเภท</option>
              <option value="ชายคู่">ชายคู่</option>
              <option value="หญิงคู่">หญิงคู่</option>
              <option value="คู่ผสม">คู่ผสม</option>
            </select>
          </div>
        </div>


        
        

        {[1,2].map((num) => (
          <div key={num}>
            <hr />
            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
              นักกีฬาคนที่ {num}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="firstName"
                  placeholder="ชื่อจริง"
                  value={form[`player${num}` as 'player1' | 'player2'].firstName}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">นามสกุล</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="lastName"
                  placeholder="นามสกุล"
                  value={form[`player${num}` as 'player1' | 'player2'].lastName}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">เพศ</label>
                <select
                  className="border rounded p-2 w-full"
                  name="gender"
                  value={form[`player${num}` as 'player1' | 'player2'].gender}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                >
                  <option value="">เลือกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">อายุ</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="age"
                  type="number"
                  placeholder="อายุ"
                  value={form[`player${num}` as 'player1' | 'player2'].age}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="phone"
                  placeholder="เบอร์โทร"
                  value={form[`player${num}` as 'player1' | 'player2'].phone}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="email"
                  placeholder="Email"
                  value={form[`player${num}` as 'player1' | 'player2'].email}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Line ID</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="lineId"
                  placeholder="Line ID"
                  value={form[`player${num}` as 'player1' | 'player2'].lineId}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ไซส์เสื้อ</label>
                <select
                  className="border rounded p-2 w-full"
                  name="shirtSize"
                  value={form[`player${num}` as 'player1' | 'player2'].shirtSize}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                >
                  <option value="">เลือกไซส์</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ข้อความบนหลังเสื้อ</label>
                <input
                  className="border rounded p-2 w-full placeholder-gray-300 placeholder-opacity-100"
                  name="shirtText"
                  placeholder="ใส่ชื่อหรือข้อความ"
                  value={form[`player${num}` as 'player1' | 'player2'].shirtText}
                  onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded w-full mt-4"
        >
          ยืนยันการลงทะเบียน
        </button>

        {message && (
          <p className="text-center text-green-600 font-medium">{message}</p>
        )}
      </form>
    </main>
  )
}
