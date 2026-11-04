
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm.jsx";
import {
  Workflow,
  Users,
  Share2,
  GitBranch,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* Left section */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-50 p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Workflow className="h-8 w-8 text-indigo-600" />
          FlowSpace
        </Link>

        <div className="relative z-10 max-w-lg">
          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
            <Sparkles className="mr-2 inline h-4 w-4" />
            Create together
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight text-gray-900">
            Your ideas deserve a space to grow.
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-500">
            Join FlowSpace and collaborate with your team.
            Create diagrams, share ideas, and build something amazing together.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: Users, title: "Team collaboration" },
              { icon: Share2, title: "Share your ideas" },
              { icon: GitBranch, title: "Version history" },
              { icon: Workflow, title: "Visual workspace" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <item.icon className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} FlowSpace
        </p>
      </section>

      {/* Right section */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center gap-2 text-xl font-bold text-gray-900 lg:hidden">
            <Workflow className="h-7 w-7 text-indigo-600" />
            FlowSpace
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-500">
              Get started with your collaborative workspace.
            </p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
