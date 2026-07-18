import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <SignUp 
        appearance={{
          elements: {
            card: "shadow-xl rounded-3xl border border-white/60",
            headerTitle: "text-slate-900",
            headerSubtitle: "text-slate-500",
          }
        }}
      />
    </div>
  );
}