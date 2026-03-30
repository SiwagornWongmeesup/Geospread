import "../globals.css";

export default function AuthLayout({ children }) {
  return (
   <div className="flex flex-col min-h-screen">
      <main className="grow">
        {children} 
      </main>
    </div>
  );
}