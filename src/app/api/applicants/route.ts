import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
    console.log('API /api/applicants ถูกเรียกแล้ว')  // ดูว่าเรียกมาไหม
  
    const { data, error } = await supabase
      .from('res_abc_bad')
      .select('*')
  
    if (error) {
      console.error('เกิด error ใน Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  
    console.log('ดึงข้อมูลจาก DB ได้:', data)
  
    const transformed = data.map(item => ({
      id: item.id,
      teamName: item.team_name,
      category: item.category,
      player1: item.player1_name,
      player2: item.player2_name,
      createdAt: item.created_at,
    }))
  
    console.log('ส่งข้อมูลไป frontend:', transformed)
  
    return NextResponse.json(transformed)
  }
  