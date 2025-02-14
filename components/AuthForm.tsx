'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
}

interface SignUpFormFields {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  password: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const schema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    address1: z.string().min(1, { message: 'Address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string()
      .length(2, { message: 'State must be a 2-letter code (e.g., NY)' })
      .toUpperCase(),
    postalCode: z.string()
      .length(5, { message: 'Postal code must be 5 digits' }),
    dateOfBirth: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
    ssn: z.string()
      .min(4, { message: 'SSN must be at least 4 digits' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  });

  type SignUpFormData = z.infer<typeof schema>;

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      setDebugInfo('Preparing user data...');
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        dateOfBirth: data.dateOfBirth,
        ssn: data.ssn,
        email: data.email,
        password: data.password
      };

      setDebugInfo('Calling signUp function...');
      const newUser = await signUp(userData);
      
      if (!newUser) {
        throw new Error('Failed to create account. Please check the console for more details.');
      }

      setDebugInfo('User created successfully!');
      setUser(newUser);
      router.push('/');
    } catch (error: any) {
      console.error('Auth error details:', {
        message: error.message,
        stack: error.stack,
        type: error.type,
        code: error.code
      });

      // Handle specific error cases
      if (error.type === 'user_already_exists' || error.message.includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.type === 'document_invalid_structure') {
        setError('There was an issue with your registration. Please try again later.');
      } else {
        setError(error.message || 'Something went wrong. Please try again.');
      }

      setDebugInfo(`Error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4">
          <CustomInput<SignUpFormData> control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
          <CustomInput<SignUpFormData> control={form.control} name='lastName' label="Last Name" placeholder='Enter your last name' />
        </div>
        <CustomInput<SignUpFormData> control={form.control} name='address1' label="Address" placeholder='Enter your specific address' />
        <CustomInput<SignUpFormData> control={form.control} name='city' label="City" placeholder='Enter your city' />
        <div className="flex gap-4">
          <CustomInput<SignUpFormData> control={form.control} name='state' label="State" placeholder='Example: NY' />
          <CustomInput<SignUpFormData> control={form.control} name='postalCode' label="Postal Code" placeholder='Example: 11101' />
        </div>
        <div className="flex gap-4">
          <CustomInput<SignUpFormData> control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' />
          <CustomInput<SignUpFormData> control={form.control} name='ssn' label="SSN" placeholder='Example: 1234' />
        </div>

        <CustomInput<SignUpFormData> control={form.control} name='email' label="Email" placeholder='Enter your email' />
        <CustomInput<SignUpFormData> control={form.control} name='password' label="Password" placeholder='Enter your password' />

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isLoading} className="form-btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp;
                Loading...
              </>
            ) : 'Sign Up'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const formSchema = authFormSchema('sign-in');
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      setDebugInfo('Attempting to sign in...');
      const response = await signIn({
        email: data.email,
        password: data.password,
      });

      if (!response) {
        throw new Error('Invalid email or password. Please try again.');
      }

      setDebugInfo('Sign in successful! Redirecting...');
      
      // Força a revalidação da página antes do redirecionamento
      await router.refresh();
      
      // Aguarda um momento para garantir que a sessão foi estabelecida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireciona para a página inicial com um hard refresh
      window.location.replace('/');
      
    } catch (error: any) {
      console.error('Auth error details:', {
        message: error.message,
        stack: error.stack,
        type: error.type,
        code: error.code
      });
      setError(error.message || 'Something went wrong. Please try again.');
      setDebugInfo(`Error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomInput<FormData> control={form.control} name='email' label="Email" placeholder='Enter your email' />
        <CustomInput<FormData> control={form.control} name='password' label="Password" placeholder='Enter your password' />

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isLoading} className="form-btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp;
                Loading...
              </>
            ) : 'Sign In'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  return (
    <section className="auth-form">
      <header className='flex flex-col gap-5 md:gap-8'>
          <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image 
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="OneG8 logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">OneG8</h1>
          </Link>

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
              {user 
                ? 'Link Account'
                : type === 'sign-in'
                  ? 'Sign In'
                  : 'Sign Up'
              }
              <p className="text-16 font-normal text-gray-600">
                {user 
                  ? 'Link your account to get started'
                  : 'Please enter your details'
                }
              </p>  
            </h1>
          </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {debugInfo && process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mt-2">
          Debug: {debugInfo}
        </div>
      )}

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ): (
        <>
          {type === 'sign-up' ? <SignUpForm /> : <SignInForm />}

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
              ? "Don't have an account?"
              : "Already have an account?"}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
              {type === 'sign-in' ? 'Sign up' : 'Sign in'}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm