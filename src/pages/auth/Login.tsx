import React, { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const Login: React.FC = () => {
  const loginAPI = useLogin();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading(`Logging in... please wait`);
    loginAPI.mutate(payload, {
      onSuccess(response) {
        toast.success(`Login Successfully`);
        sessionStorage.setItem("token", response?.token);
        navigate("/dashboard");
      },
      onError(err) {
        // @ts-expect-error axios error
        toast.error(`Unable to login - ${err?.response?.data?.error}`);
        console.log({ err });
      },
      onSettled() {
        toast.dismiss();
      },
    });
  };
  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#004954] items-center justify-center text-white px-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg opacity-80">
            Sign in to continue accessing your dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Login</h2>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setPayload((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setPayload((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox text-[#004954]"
                />
                <span className="ml-2">Remember me</span>
              </label>
              {/* <a href="#" className="text-sm text-[#004954] hover:underline">
                Forgot password?
              </a> */}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#004954] text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              // @ts-expect-error form erro
              onClick={handleSubmit}
              disabled={loginAPI.isPending}
            >
              Sign In
            </button>
          </form>

          {/* <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
