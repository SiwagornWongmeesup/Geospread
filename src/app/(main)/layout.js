import "../globals.css";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
   <div className="flex flex-col min-h-screen">
      <Navbar /> 
      <main className="grow">
        {children} 
      </main>
    </div>
  );
}