'use client';

import VideoSection from "@/components/Video";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 sm:px-12 py-12">

      <div className="max-w-6xl mx-auto">

        {/* 🧾 HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            About Roop By Arti ✨
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Crafting elegance that reflects your true beauty — timeless jewellery for every moment.
          </p>
        </div>

        {/* 👥 TEAM SECTION */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">

          
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <img
              src="/Founder.png"
              className="w-full h-60 object-cover rounded-xl mb-3"
            />
            <h3 className="font-semibold">Founder</h3>
            <p className="text-sm text-gray-500">Arti Sehgal</p>
          </div>

         
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <img
              src="/Co-Founder.png"
              className="w-full h-60 object-cover rounded-xl mb-3"
            />
            <h3 className="font-semibold">Co-Founder</h3>
            <p className="text-sm text-gray-500">Praveen</p>
          </div>

          
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <img
              src="/CFO.png"
              className="w-full h-60 object-cover rounded-xl mb-3"
            />
            <h3 className="font-semibold">CFO</h3>
            <p className="text-sm text-gray-500">Madhur Chhabra</p>
          </div>

         
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <img
              src="/CTO.png"
              className="w-full h-60 object-cover rounded-xl mb-3"
            />
            <h3 className="font-semibold">CTO</h3>
            <p className="text-sm text-gray-500">Abhinav</p>
          </div>

        </div> */}

        {/* 🎯 OUR MISSION */}
        <div className="grid md:grid-cols-2 gap-10 items-center bg-white p-8 rounded-2xl shadow">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Our Mission 💎
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              At Roop By Arti, our mission is to bring elegance into everyday life.
              We aim to create jewellery that empowers women to feel confident,
              beautiful, and unique.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Every design reflects a balance of modern style and timeless tradition,
              ensuring that each piece becomes a part of your personal story.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <img
              src="/mission.jpg"   // 👈 yahan ap model image dal dena
              className="w-full h-[350px] object-cover rounded-xl"
            />
          </div>

        </div>

      </div>
<VideoSection/>
    </div>
  );
}