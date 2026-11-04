
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import {
  Workflow,
  Users,
  Share2,
  GitBranch,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <section className="hidden lg:flex flex-col justify-between bg-slate-50 p-12 xl:p-16 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-60" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 w-fit">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Workflow size={25} />
          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-900">
            FlowSpace
          </span>
        </Link>

        {/* Hero content */}
        <div className="relative max-w-xl">

          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-indigo-700 text-sm font-medium mb-8">
            <Sparkles size={16} />
            Create. Collaborate. Connect.
          </div>

          <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Ideas move
            <span className="block text-indigo-600">
              better together.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
            Turn complex ideas into clear diagrams.
            Collaborate with your team in real time
            and share knowledge with the world.
          </p>

          {/* Feature cards */}
          <div className="mt-12 grid grid-cols-2 gap-4">

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <Users className="text-indigo-600 mb-4" size={24} />
              <h3 className="font-semibold text-gray-900">
                Work together
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Collaborate with your team.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <Share2 className="text-indigo-600 mb-4" size={24} />
              <h3 className="font-semibold text-gray-900">
                Share ideas
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Publish and discover diagrams.
              </p>
            </div>

          </div>

          {/* Decorative workflow */}
          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <GitBranch size={19} />
            </div>
            Visualize your thinking, one connection at a time.
          </div>

        </div>

        {/* Footer */}
        <div className="relative text-sm text-gray-400">
          © {new Date().getFullYear()} FlowSpace. Built for collaboration.
        </div>

      </section>

      {/* RIGHT SIDE */}
      <section className="flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-16">

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Workflow size={23} />
          </div>
          <span className="text-xl font-bold text-gray-900">
            FlowSpace
          </span>
        </Link>

        <LoginForm />

      </section>

    </main>
  );
}
