"use client";
import { UserButton } from '@clerk/nextjs';
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
      <button className="md:hidden text-slate-600"><Menu /></button>
      <div className="flex items-center gap-6 text-sm font-medium ml-auto">
        <div className="w-10 h-10 flex items-center justify-center"><UserButton /></div>
      </div>
    </header>
  );
}