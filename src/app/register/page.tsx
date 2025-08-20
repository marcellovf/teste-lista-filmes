'use client';

import { useActionState } from 'react';    
import { useFormStatus } from 'react-dom';
import { registerAction, FormState } from '../actions';
import Link from 'next/link';

function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      aria-disabled={pending}
      className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
    >
      {pending ? 'Registrando...' : 'Registrar'}
    </button>
  );
}

export default function RegisterPage() {
  const initialState: FormState = undefined;
  const [state, dispatch] = useActionState(registerAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">Crie sua Conta</h1>
        <form action={dispatch} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-300 block mb-2">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="name"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state?.errors?.name && <p className="text-sm text-red-400 mt-1">{state.errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-300 block mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state?.errors?.email && <p className="text-sm text-red-400 mt-1">{state.errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-300 block mb-2">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state?.errors?.password && <p className="text-sm text-red-400 mt-1">{state.errors.password}</p>}
          </div>
          
          {state?.message && <p className="text-sm text-red-400 text-center">{state.message}</p>}
          
          <RegisterButton />

          <p className="text-center text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link href="/" className="font-medium text-cyan-400 hover:underline">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
