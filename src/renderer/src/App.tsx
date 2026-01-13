import { RouterProvider } from "react-router"
import { router } from "./routes/AppRoutes"
import SplashScreen from "./components/SplashScreen"
import { JSX, useState } from "react"

function App(): JSX.Element {
  // 🔥 READ from localStorage on first render
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem("hasSeenSplash")
  })

  const handleSplashFinish = () => {
    localStorage.setItem("hasSeenSplash", "true")
    setShowSplash(false)
  }

  return (
    <div className="w-full h-screen">
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  )
}

export default App
