import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { AuthShell } from '@/components/auth-shell'

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start designing beautiful invitations and seamless check-ins."
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
