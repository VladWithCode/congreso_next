"use client";

import Image from "next/image";
import { getUsers } from "./usuarios/service";

export default function Home() {
  const onGetClick = async () => {
    try {
      const response = await getUsers();
      alert(response);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl mb-4">Hello world!</h1>
      <button
        className="bg-indigo-600 rounded-md text-stone-50 p-2"
        onClick={(e) => onGetClick()}
      >
        Get users
      </button>
    </div>
  );
}
