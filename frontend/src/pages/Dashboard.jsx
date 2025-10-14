import React from 'react'

const Dashboard = () => {
  return (
    <div className="p-4 text-gray-800 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Welcome to FFWS Jatim Dashboard
        </h2>
        <p className="text-green-700">
          Sistem refresh token telah diaktifkan. Token akan di-refresh otomatis sebelum expired, 
          sehingga Anda tidak perlu login berulang saat menggunakan aplikasi.
        </p>
      </div>
    </div>
  )
}

export default Dashboard

