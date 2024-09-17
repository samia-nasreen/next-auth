"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import PostCard from "./PostCard";
import { useRouter } from "next/navigation";

const Dashboard = ({ session }: { session: any }) => {
  const [data, setData] = useState([]);
  const [tokenData, setTokenData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      console.log("Refresh token error, logging out...");
      signOut({ callbackUrl: "/signin" });
    }
  }, [session?.error]);

  const fetchProtectedData = async () => {
    setLoading(true);
    try {
      const token = session.access_token;

      const response = await fetch("/api/get-posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.posts);
        setTokenData(result.data);
        setError("");
      } else {
        const errorResult = await response.json();
        setData([]);
        setError(errorResult.error || "An unknown error occurred");

        await signOut({ redirect: false });
        router.push("/signin");
      }
    } catch (err) {
      setData([]);
      setTokenData([]);
      setError("An error occurred while fetching data");

      console.error("Error fetching protected data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Image
        src={session.user?.image as string}
        alt="profile"
        width={80}
        height={80}
        priority={true}
        className="rounded-full"
      />
      <h1 className="text-xl text-green-500">
        Welcome back,{" "}
        {session.user?.name ? session.user?.name : session.user?.username}
      </h1>
      <p>Email: {session.user?.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="p-[1em] border border-gray-300 rounded-md hover:bg-red-300"
      >
        Sign out
      </button>

      <button
        onClick={fetchProtectedData}
        className="p-[1em] border border-gray-300 rounded-md hover:bg-blue-300 mt-4 ml-4"
        disabled={loading}
      >
        {loading ? "Loading..." : "See posts"}
      </button>

      {loading && (
        <Image src="/spinner.gif" alt="Loading..." width={32} height={32} />
      )}

      {tokenData && (
        <div className="mt-4">
          <h1 className="text-xl font-bold text-teal-800 mb-4">Token Data</h1>
          <pre>{JSON.stringify(tokenData, null, 2)}</pre>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-4">
          <h1 className="text-xl font-bold text-teal-800 mb-4">All Posts</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 border border-red-300 rounded-md text-red-500">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
