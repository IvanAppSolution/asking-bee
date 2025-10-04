"use client";
import Image from "next/image";
import Link from "next/link";
import { useScore } from "../contexts/ScoreContext";

export default function Navbar() {
  const { setCurrentScore, setTotalQuestions, setLevelSelected } = useScore();
  return (
    <nav className="bg-white shadow-md py-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
        <Link href={"/"} className="flex items-center">
          <Image src={"/logo.jpg"} alt="logo" width={50} height={50} />
          <span className="text-2xl font-bold text-gray-800">
            Asking Bee
          </span>
        </Link>
        <div className="space-x-4">
          <div className="inline-block text-gray-600 hover:text-gray-800 cursor-pointer">            
              <select 
                onChange={(e) => {setCurrentScore(0); setTotalQuestions(0); setLevelSelected(Number(e.target.value));}}
                id="level" name='level' 
                className="bg-gray-50 border border-gray-300 px-2 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500">
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
