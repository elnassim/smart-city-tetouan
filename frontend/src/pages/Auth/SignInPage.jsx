import { SignIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function SignInPage() {
  const { isSignedIn } = useAuth()
  
  if (isSignedIn) {
    return <Navigate to="/" />
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <SignIn 
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
        />
      </div>
    </div>
  )
}
