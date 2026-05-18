import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '../../lib/supabase/client'
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js'
import { useAuthStore } from '../client/useAuthStore'
import { useAccountStore } from '../client/useAccountStore'
import { toast } from 'sonner'


export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: SignInWithPasswordCredentials) => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword(credentials)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    onSuccess: (data) => {
      if (data.session && data.user) {
        useAuthStore.getState().setSession(data.session)
        useAuthStore.getState().setUser(data.user)
      }
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (credentials: SignUpWithPasswordCredentials) => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({ ...credentials })
      if (error) throw new Error(error.message)
      return data
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      useAuthStore.getState().clearAuth()
      useAccountStore.getState().clearAccountState()
      queryClient.clear()
      window.location.href = '/auth/login'
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      })
      if (error) {
        throw new Error(error.message)
      }
    },
  })
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password,
      })
      if (error) {
        throw new Error(error.message)
      }
    },
  })
}

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.updateUser({
        data: { name, full_name: name },
      })
      if (error) throw new Error(error.message)
      return data.user
    },
    onSuccess: (user) => {
      if (user) useAuthStore.getState().setUser(user)
      toast.success('Profile updated successfully.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => {
      const supabase = createClient()
      const currentUser = useAuthStore.getState().user
      if (!currentUser?.email) throw new Error('No authenticated user found.')

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      })
      if (authError) throw new Error('Current password is incorrect.')

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      toast.success('Password changed successfully.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
