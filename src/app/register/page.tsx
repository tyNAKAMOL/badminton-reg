"use client";
import React, { useState } from 'react';

const steps = ['อ่านรายละเอียดและยืนยันข้อตกลง', 'กรอกข้อมูลการลงทะเบียน', 'อัพโหลดหลักฐานการชำระเงิน'];

export default function BadmintonRegistrationStepper() {
    interface PlayerInfo {
        firstName: string;
        lastName: string;
        gender: string;
        email: string;
        age: string;
        phone: string;
        lineId: string;
        shirtSize: string;
        shirtText: string;
      }
  const [activeStep, setActiveStep] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    teamName: '',
    category: '',
    player1: {
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
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
      email: '',
      age: '',
      phone: '',
      lineId: '',
      shirtSize: '',
      shirtText: ''
    }
  });

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

  const handleNext = () => {
    if (activeStep === 0 && !agreedToTerms) {
      setMessage('กรุณายืนยันข้อตกลงก่อนดำเนินการต่อ');
      return;
    }
    
    if (activeStep === 1) {
      // Validate form
      const requiredFields: (keyof typeof form)[] = ['teamName', 'category'];
      const playerFields: (keyof PlayerInfo)[] = [
        'firstName',
        'lastName',
        'gender',
        'age',
        'phone',
        'email',
        'lineId',
        'shirtSize',
        'shirtText',
      ];
      for (const field of requiredFields) {
        if (!form[field]) {
          setMessage(`กรุณากรอก${field === 'teamName' ? 'ชื่อทีม' : 'ประเภททีม'}`);
          return;
        }
      }
      
      for (const playerNum of [1, 2]) {
        const player = form[`player${playerNum}` as 'player1' | 'player2'];
        for (const field of playerFields) {
          if (!player[field]) {
            setMessage(`กรุณากรอกข้อมูลนักกีฬาคนที่ ${playerNum} ให้ครบถ้วน`);
            return;
          }
        }
      }
    }
    
    if (activeStep === 2 && !uploadedFile) {
      setMessage('กรุณาอัพโหลดหลักฐานการชำระเงิน');
      return;
    }
    
    setMessage('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setMessage('');
  };

//   const handleReset = () => {
//     setActiveStep(0);
//     setAgreedToTerms(false);
//     setUploadedFile(null);
//     setMessage('');
//     setForm({
//       teamName: '',
//       category: '',
//       player1: {
//         firstName: '',
//         lastName: '',
//         gender: '',
//         email: '',
//         age: '',
//         phone: '',
//         lineId: '',
//         shirtSize: '',
//         shirtText: ''
//       },
//       player2: {
//         firstName: '',
//         lastName: '',
//         gender: '',
//         email: '',
//         age: '',
//         phone: '',
//         lineId: '',
//         shirtSize: '',
//         shirtText: ''
//       }
//     });
//   };

  const handleSubmit = async () => {
    try {
      // Simulate API call
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paymentSlip: uploadedFile?.name
        })
      });
      
      if (res.ok) {
        setMessage('✅ ลงทะเบียนสำเร็จ');
        setActiveStep(steps.length);
      } else {
        const data = await res.json();
        setMessage(`${data.error}`);
      }
    } catch (error) {
        console.error(error);
        setMessage('✅ ลงทะเบียนสำเร็จ (Demo Mode)');
        setActiveStep(steps.length);
      }
      
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_preset"); // <<< ชื่อ Preset ที่คุณสร้าง
      formData.append("folder", "badminton_receipts"); // (ไม่บังคับ) สร้างโฟลเดอร์ใน Cloudinary
  
      // Upload to Cloudinary
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/deujra2eg/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log("Uploaded URL:", data.secure_url);
        setUploadedUrl(data.secure_url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };
  
  

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-start mb-6">
              <div className="w-24 h-24 bg-emerald-50 rounded-xl flex items-center justify-center mr-4">
                <img src='/images/logo.png' alt='logo'/>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-700">
                  ลงทะเบียนแข่งขันแบดมินตัน
                </h1>
                <p className="text-gray-600">4 ตุลาคม 2568</p>
                <p className="text-sm text-gray-600">
                  ณ ทวิมุขแบดมินตัน รามคำแหง 36/1
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <img src='/images/rules.png' alt='rules'/>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <img src='/images/rack.png' alt='rack'/>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg text-gray-600">ลูกแบดที่ใช้แข่งขัน</h3>
              <img src='/images/u.png' alt='u'/>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg text-gray-600">เสื้อทีม</h3>
              <p className="text-sm text-gray-700 pb-6">
                ทีมที่ลงทะเบียนจะได้รับเสื้อทีมพร้อมชื่อที่กำหนดเอง
                สามารถเลือกไซส์และข้อความที่ต้องการพิมพ์ได้
              </p>
              <img src='/images/shirt.png' alt='rak'/>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg text-gray-700">การชำระเงิน</h3>
              <p className="text-sm text-gray-700">
                ชำระผ่านการโอนเงินและอัพโหลดหลักฐานการชำระเงิน
                ภายหลังจากกรอกข้อมูลเรียบร้อยแล้ว
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  ฉันได้อ่านและยอมรับเงื่อนไขการแข่งขันแล้ว
                </span>
              </label>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อทีม</label>
                <input
                  className="
                  w-full 
                  px-4 py-2
                  border border-gray-300
                  rounded-lg
                  text-gray-800
                  bg-white
                  focus:outline-none
                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-200
                  transition
                  placeholder-gray-200
                "
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
                  name="teamName"
                  value={form.teamName}
                  onChange={handleChange}
                  placeholder="เช่น ทีมสายฟ้า"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภททีม</label>
                <select
                  className="
                  w-full 
                  px-4 py-2
                  mt-2
                  border border-gray-300
                  rounded-lg
                  text-gray-200
                  bg-white
                  focus:outline-none
                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-200
                  transition
                  placeholder-gray-300
                "
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-200
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
            name="gender"
            value={form[`player${num}` as 'player1' | 'player2'].gender}
            onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

            required
          >
            <option value="">เลือกเพศ</option>
            <option value="M">ชาย</option>
            <option value="W">หญิง</option>
            <option value="LGPTQ+">LGPTQ+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">อายุ</label>
          <input
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-200
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
            name="shirtSize"
            value={form[`player${num}` as 'player1' | 'player2'].shirtSize}
            onChange={(e) => handleChange(e, `player${num}` as 'player1' | 'player2')}

            required
          >
            <option value="">เลือกไซส์</option>
            <option value="S">S (อก 36 / ยาว 25)</option>
            <option value="M">M (อก 38 / ยาว 26)</option>
            <option value="L">L (อก 40 / ยาว 27)</option>
            <option value="XL">XL (อก 42 / ยาว 28)</option>
            <option value="2XL">2XL (อก 44 / ยาว 29)</option>
            <option value="3XL">3XL (อก 46 / ยาว 30)</option>
            <option value="4XL">4XL (อก 48 / ยาว 31)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ข้อความบนหลังเสื้อ</label>
          <input
            className="
            w-full 
            px-4 py-2
            mt-2
            border border-gray-300
            rounded-lg
            text-gray-800
            bg-white
            focus:outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-200
            transition
            placeholder-gray-300
          "
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
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
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-4"> อัพโหลดหลักฐานการชำระเงิน</h3>
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
                <div className="text-gray-800 space-y-2 flex flex-col items-center text-center">
                    <img src='/images/kplus.png' alt='k' width={50} className=''/>
                  <p className="font-semibold">ข้อมูลการชำระเงิน</p>
                  <p><strong>ค่าสมัคร:</strong> 1,600 บาท/คู่</p>
                  <p><strong>ธนาคาร:</strong> ธนาคารกรุงไทย</p>
                  <p><strong>เลขบัญชี:</strong> 187-3-26737-9</p>
                  <p><strong>ชื่อบัญชี:</strong> Nakamol Saeheng</p>
                </div>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-lg text-gray-600 mb-2">
                  {uploadedFile ? uploadedFile.name : 'คลิกเพื่อเลือกไฟล์'}
                </span>
                <span className="text-sm text-gray-500">
                  หรือลากไฟล์มาวาง (รองรับไฟล์ภาพเท่านั้น)
                </span>
              </label>
            </div>
            {uploadedUrl && (
                <div className="mt-4">
                    <img
                    src={uploadedUrl}
                    alt="Uploaded receipt"
                    className="max-w-xs rounded shadow"
                    />
                    <p className="text-sm text-gray-600 mt-2">ไฟล์ที่อัพโหลดแล้ว</p>
                </div>
            )}

            {uploadedFile && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-medium">
                    อัพโหลดไฟล์สำเร็จ: {uploadedFile.name}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">สรุปข้อมูลการลงทะเบียน</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>ชื่อทีม:</strong> {form.teamName}</p>
                <p><strong>ประเภท:</strong> {form.category}</p>
                <p><strong>นักกีฬาคนที่ 1:</strong> {form.player1.firstName} {form.player1.lastName}</p>
                <p><strong>นักกีฬาคนที่ 2:</strong> {form.player2.firstName} {form.player2.lastName}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Custom Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= activeStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {index < activeStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-20 h-1 mx-2
                    ${index < activeStep ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            {steps.map((step, index) => (
              <div key={index} className="text-center max-w-32">
                <p className={index <= activeStep ? 'text-blue-600 font-medium' : ''}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeStep === steps.length ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                ลงทะเบียนสำเร็จ!
              </h2>
              <p className="text-gray-600 mb-2">
                ขอบคุณที่ลงทะเบียนเข้าร่วมการแข่งขันแบดมินตัน
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
                <p className="text-sm text-gray-700">
                  <strong>ทีม:</strong> {form.teamName} | <strong>ประเภท:</strong> {form.category}
                </p>
              </div>
          
            </div>
          ) : (
            <>
              {renderStepContent(activeStep)}
              
              {message && (
                <div className={`
                  mt-4 p-4 rounded-lg border
                  ${message.includes('✅') 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                  }
                `}>
                  {message}
                </div>
              )}
              
              <div className="flex justify-between pt-6 border-t mt-6">
                <button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-colors
                    ${activeStep === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  Back
                </button>
                <button
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


