"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      if (response.ok) {
        setEmail("");
        setPassword("");
        setUsername("");
        setError("");

        router.push("/signin");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-gray-300 rounded-md shadow-lg bg-white p-8 w-full max-w-sm">
        <h1 className="text-4xl text-teal-700 font-medium text-center mb-6">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-1 text-gray-700 font-medium"
            >
              Username
            </label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

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

          {error && <p className="text-red-500">{error}</p>}

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

          <button
            type="submit"
            className="p-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300"
            disabled={loading}
          >
            Sign Up
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

          <p className="text-center">
            Already have an account?{" "}
            <span className="text-teal-700 font-medium text-lg">
              <Link href="/signin">SignIn</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
