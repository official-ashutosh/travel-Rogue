"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button.jsx"
import { Input } from "../components/ui/Input.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import LoadingSpinner from "../components/common/LoadingSpinner.jsx"
import { UserPlus, ArrowLeft, CheckCircle2 } from "lucide-react"

const SignupPage = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    const result = await signup({
      firstName,
      lastName,
      email,
      password,
    })

    if (result.success) {
      navigate("/dashboard")
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const features = [
    "AI-powered travel planning",
    "Personalized recommendations",
    "Smart budget optimization",
    "Real-time travel updates",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-72 h-72 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/15 dark:to-indigo-900/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/15 dark:to-pink-900/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">

        <Card className="border border-slate-200/50 dark:border-gray-700/50 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-2xl transition-all duration-500">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Account</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Start planning extraordinary adventures with AI-powered intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">What you'll get:</h3>
              <div className="grid grid-cols-1 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm animate-shake">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                    {error}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="First name"
                    disabled={loading}
                    className="h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Last name"
                    disabled={loading}
                    className="h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  className="h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                  className="h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  disabled={loading}
                  className="h-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group relative overflow-hidden"
                disabled={loading}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700 -skew-x-12"></div>

                {loading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 dark:bg-gray-800/90 text-slate-500 dark:text-slate-400 backdrop-blur-sm">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 text-blue-700 dark:text-blue-300 font-semibold rounded-xl border border-blue-200 dark:border-blue-800/50 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-950/70 dark:hover:to-purple-950/70 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                >
                  Sign In Instead
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage
