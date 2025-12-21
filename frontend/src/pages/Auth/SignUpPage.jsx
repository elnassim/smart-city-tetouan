import { SignUp } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function SignUpPage() {
  const { isSignedIn } = useAuth()
  
  if (isSignedIn) {
    return <Navigate to="/" />
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  )
}
