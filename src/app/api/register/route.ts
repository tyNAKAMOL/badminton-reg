import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teamName, category, player1, player2 } = body

    if (!teamName || !category || !player1.firstName || !player2.firstName) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 })
    }

    // บันทึก Supabase
    const { error } = await supabase.from('res_abc_bad').insert([
      {
        team_name: teamName,
        category: category,
        player1_name: player1.firstName,
        player1_surname: player1.lastName,
        player1_gender: player1.gender,
        player1_age: player1.age,
        player1_phone: player1.phone,
        player1_line: player1.lineId,
        player1_shirt_size: player1.shirtSize,
        player1_shirt_text: player1.shirtText,
        player2_name: player2.firstName,
        player2_surname: player2.lastName,
        player2_gender: player2.gender,
        player2_age: player2.age,
        player2_phone: player2.phone,
        player2_line: player2.lineId,
        player2_shirt_size: player2.shirtSize,
        player2_shirt_text: player2.shirtText,
        player2_email:player2.email,
        player1_email:player1.email
      },
    ])
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ส่ง Email
    await resend.emails.send({
      from: 'beauty.nkm39@gmail.com',
      to: [player1.email, player2.email],
      subject: 'ยืนยันการลงทะเบียนแข่งขันแบดมินตัน',
      html: `
        <h2>ขอบคุณที่ลงทะเบียน</h2>
        <p>ทีม: ${teamName}</p>
        <p>ประเภท: ${category}</p>
        <p>แล้วพบกันในวันแข่งขัน!</p>
      `,
    })

    // แจ้ง Discord Webhook
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🎉 **มีผู้สมัครใหม่!**
ทีม: ${teamName}
ประเภท: ${category}
ผู้เล่น1: ${player1.firstName} ${player1.lastName}
ผู้เล่น2: ${player2.firstName} ${player2.lastName}`
      })
    })

    return NextResponse.json({ message: 'ลงทะเบียนสำเร็จ' })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
