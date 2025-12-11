import { useState } from "react";
import GeometricPatternBackground from "@/components/GeometricPatternBackground";
import { signIn } from "@/lib/auth/auth-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message || "An error occurred during sign in");
        },
      },
    );
  };

  const handleSignup = () => {
    // Open signup page in new tab
    chrome.tabs.create({ url: "https://opencontext.ai/sign-up" }); // Placeholder URL
  };

  return (
    <div
      className="relative bg-[#0a1929] text-white overflow-hidden"
      style={{ minHeight: "600px", width: "400px" }}
    >
      <GeometricPatternBackground />

      <div className="relative z-10 flex flex-col h-screen justify-center items-center p-6">
        <div className="w-full max-w-md bg-[rgba(10,25,41,0.8)] backdrop-blur-sm rounded-lg p-6 border border-[rgba(77,181,207,0.2)]">
          <div className="flex justify-center mb-2">
            <img
              src="/dark-logo.png"
              alt="OpenContext"
              className="h-8 w-auto"
            />
          </div>

          <p className="text-gray-300 mb-6 text-center">
            Sign in to your opencontext account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(77,181,207,0.2)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgba(77,181,207,0.5)]"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(77,181,207,0.2)] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[rgba(77,181,207,0.5)]"
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[rgba(77,181,207,0.5)] hover:bg-[rgba(77,181,207,0.7)] disabled:opacity-50 rounded-md transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleSignup}
              className="text-blue-300 hover:underline"
            >
              Don&apos;t have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
