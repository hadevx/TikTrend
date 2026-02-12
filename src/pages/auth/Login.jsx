import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/queries/userApi";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Layout from "../../Layout";
import { loginUserSchema } from "../../schema/userSchema";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { email, password } = form;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Device helpers (no extra libs)
  const getDeviceInfo = () => {
    const ua = navigator.userAgent || "";
    const platform = navigator?.userAgentData?.platform || navigator.platform || "";
    const language = navigator.language || "";
    const screenSize =
      typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "";
    const timezone =
      typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";

    return {
      userAgent: ua,
      platform,
      language,
      screen: screenSize,
      timezone,
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        return toast.error("All fields are required", { position: "top-center" });
      }

      const result = loginUserSchema.safeParse({ email, password });
      if (!result.success) return toast.error(result.error.issues[0].message);

      // ✅ Send device info to backend
      const deviceInfo = getDeviceInfo();

      const res = await loginUser({
        email,
        password,
        deviceInfo, // 👈 backend should save this + lastLoginAt
      }).unwrap();

      dispatch(setUserInfo({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "An error occurred", {
        position: "top-center",
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">Login</h1>
          <p className="mt-1 text-sm text-zinc-500">Welcome back</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border bg-zinc-50 px-3 outline-none
                  focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm text-zinc-700">Password</label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border bg-zinc-50 px-3 pr-11 outline-none
                    focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 text-zinc-500 hover:text-zinc-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="h-11 w-full rounded-xl bg-zinc-900 text-white font-semibold
                hover:bg-zinc-800 disabled:opacity-70 flex items-center justify-center">
              {!isLoading ? "Log in" : <Spinner className="border-t-zinc-900" />}
            </button>
          </form>

          <p className="mt-5 text-sm text-zinc-600">
            Don’t have an account?{" "}
            <Link to="/register" className="font-semibold underline underline-offset-4">
              Register
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
