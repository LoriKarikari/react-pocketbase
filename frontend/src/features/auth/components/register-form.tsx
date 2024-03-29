import { registerInputSchema } from '@auth/schemas'
import { RegisterInput } from '@auth/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { pb } from '@lib/pocketbase'
import { useForm } from 'react-hook-form'
import { useLocation } from 'wouter'

export function RegisterForm() {
  const [location, navigate] = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
  })

  async function handleRegister(data: RegisterInput) {
    const { email, password } = data
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
      })
      await pb.collection('users').authWithPassword(email, password)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <div>
        <label>Email address</label>
        <input type="email" {...register('email')} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
