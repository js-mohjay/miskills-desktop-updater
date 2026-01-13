import { RouterProvider } from "react-router";
import { router } from "./routes/AppRoutes";
import SplashScreen from "./components/SplashScreen";
import { JSX, useState } from "react";
// import { useSocketStore } from "@/store/useSocketStore";
// import {toast} from "sonner";

function App(): JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  // const { status, error, connectSocket } = useSocketStore();

  const handleSplashFinish = () => {
    localStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  // 🔌 Connect socket ONCE at app mount
  // useEffect(() => {
  //   connectSocket(false);
  // }, [connectSocket]);

  // Optional: debug / monitoring
  // useEffect(() => {
  //   console.log("Socket status:", status, error);
  //   // if(status) toast.success(status)
  //   if(error) toast.error(error)
  // }, [status, error]);

  return (
    <div className="w-full h-screen">
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <RouterProvider
          key={showSplash ? "splash" : "app"}
          router={router}
        />
      )}
    </div>
  );
}

export default App;
