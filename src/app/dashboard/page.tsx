"use client";
import { useSession } from "next-auth/react";
import Dashboard from "../../../components/Dashboard";
import Link from "next/link";
import Image from "next/image";

const MyDashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Image
        src="/spinner.gif"
        alt="Loading..."
        width={32}
        height={32}
        className="self-center p-8"
      />
    );
  }

  return (
    <div className="p-8 space-y-4">
      {session ? (
        <Dashboard session={session} />
      ) : (
        <div className="text-center border border-gray-300 p-16 rounded-lg shadow-md w-max mx-auto mt-8 bg-white">
          <h1 className="text-xl font-semibold text-gray-700 mb-8">
            You are not signed in
          </h1>
          <Link
            href="/signin"
            className="text-white bg-teal-600 p-[1em] rounded-md hover:bg-teal-700 transition-colors duration-300"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyDashboard;
