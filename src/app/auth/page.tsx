'use client';

import { login, signup } from '@/app/(auth)/auth';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton({ children, formAction }: { children: React.ReactNode; formAction: (formData: FormData) => Promise<any> }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
    >
      {pending ? '処理中...' : children}
    </button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    try {
      setError(null);
      await login(formData);
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      }
    }
  }

  async function handleSignup(formData: FormData) {
    try {
      setError(null);
      await signup(formData);
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError('新規登録に失敗しました。別のメールアドレスを試してください。');
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          アカウントにログイン
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              メールアドレス
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              パスワード
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="space-y-3">
            <SubmitButton formAction={handleLogin}>ログイン</SubmitButton>
            <SubmitButton formAction={handleSignup}>新規登録</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
} 