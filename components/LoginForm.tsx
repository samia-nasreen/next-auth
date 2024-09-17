"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      console.error("Error signing in:", result?.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-gray-300 rounded-md shadow-lg bg-white p-8 w-full max-w-sm">
        <h1 className="text-4xl text-teal-700 font-medium text-center mb-6">
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <button
            type="submit"
            className="p-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300"
          >
            Sign in with Credentials
          </button>

          {loading && (
            <Image
              src="/spinner.gif"
              alt="Loading..."
              width={32}
              height={32}
              className="self-center"
            />
          )}
        </form>

        <div className="flex items-center my-6">
          <div className="w-full h-px bg-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <div className="w-full h-px bg-gray-300" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full p-3 border border-gray-400 rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-300 text-gray-700"
        >
          Sign in with Google
        </button>

        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <span className="text-teal-700 font-medium text-lg">
            <Link href="/">SignUp</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
