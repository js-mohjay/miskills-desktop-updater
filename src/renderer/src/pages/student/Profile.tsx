"use client"

import ProfileForm from "@/components/student/ProfileForm"

const Profile = () => {
  return (
    <section className="w-full p-10">
      <div className="mb-6">
        <h2 className="text-5xl leading-tight">Profile</h2>
        <p className="text-white/60 mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[8px] p-8">
        <ProfileForm />
      </div>
    </section>
  )
}

export default Profile
