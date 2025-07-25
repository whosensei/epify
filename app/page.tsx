import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Epify Assignment
            </h1>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Welcome to the Epify Assignment project. Get started by creating your account.
          </p>
          
          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
            >
              Get Started
            </Link>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
