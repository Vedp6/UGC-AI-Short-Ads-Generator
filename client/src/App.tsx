import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SoftBackdrop from "./components/SoftBackdrop";
import Footer from "./components/Footer";
import LenisScroll from "./components/lenis";
import { Route, Routes } from "react-router-dom";
import Result from "./pages/Result";
import MyPlans from "./pages/MyPlans";
import MyGeneration from "./pages/MyGeneration";
import Loading from "./pages/Loading";
import Community from "./pages/Community";
import Generator from "./pages/Generator";
import {Toaster} from 'react-hot-toast'



function App() {
  return (
    <>
      <Toaster toastOptions={{style: {background: '#333', color: '#fff'}}}/>
      <SoftBackdrop />
      <LenisScroll />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/result/:projectId" element={<Result />} />
        <Route path="/community" element={<Community />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/my-generation" element={<MyGeneration />} />
        <Route path="/plans" element={<MyPlans />} />

      </Routes>

      <Footer />
    </>
  );
}
export default App;
