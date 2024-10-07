"use client"

import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import useToast from '../hooks/useToast';
import { FormData } from '@/types/formTypes'
import useAddressValidation from '../hooks/useAddressValidation'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Profile() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, setValue, watch, formState: { errors, isDirty }, reset } = useForm<FormData>()
    const router = useRouter()
    const { showError, showSuccess } = useToast();

    const watchAddress = watch("address")
    const { isValid, isValidating, error } = useAddressValidation(watchAddress)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace('/')
        } else if (status === "authenticated" && session.user) {
            reset({
                firstName: session.user.name || '',
                address: session.user.address || '',
                phoneNumber: session.user.phoneNumber?.replace("+33", "") || '',
                dateOfBirth: session.user.dateOfBirth ? new Date(String(session.user.dateOfBirth)).toISOString().split('T')[0] : undefined
            })
        }
    }, [status, session, router, reset])
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true)
        try {
            const res = await fetch('/api/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                showSuccess("Profile updated successfully!");
                reset(data);
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                const errorData = await res.json()
                showError(errorData.message || "An error occurred while updating the profile");
            }
        } catch (error) {
            showError("Network error. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    if (status === "loading") {
        return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-2xl font-semibold text-gray-700">Loading...</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Update Your Profile</h1>
                    <p className="text-sm text-gray-600">Keep your information up to date</p>
                </div>

                {session && session.user.image && (
                    <div className="flex justify-center">
                        <div className="relative">
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                            />
                            <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            {...register("firstName", {
                                required: "Full name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters long" }
                            })}
                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm 
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                ${errors.firstName ? 'border-red-300 text-red-700 placeholder-red-300' : 'border-gray-300 text-gray-900'} 
                                hover:border-blue-500 focus:text-black transition duration-150 ease-in-out`} placeholder="Enter your full name"
                        />
                        {errors.firstName && typeof errors.firstName.message === 'string' && <p className="mt-1 text-sm text-red-600">{errors.firstName?.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                            {...register("dateOfBirth", {
                                required: "Date of birth is required",
                                validate: value => {
                                    const dateString = String(value);
                                    const date = new Date(dateString);
                                    const now = new Date();
                                    return date < now || "Date of birth cannot be in the future";
                                }
                            })}
                            type="date"
                            className={`block w-full px-4 py-3 border rounded-lg shadow-sm 
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                ${errors.dateOfBirth ? 'border-red-300 text-red-700 placeholder-red-300' : 'border-gray-300 text-gray-900'} 
                                hover:border-blue-500 focus:text-black transition duration-150 ease-in-out`} />
                        {errors.dateOfBirth && typeof errors.dateOfBirth.message === 'string' && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="relative">
                            <input
                                {...register("address", {
                                    required: "Address is required",
                                    minLength: { value: 5, message: "Address must be at least 5 characters long" }
                                })}
                                className={`block w-full px-4 py-3 border rounded-lg shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                    ${errors.address ? 'border-red-300 text-red-700 placeholder-red-300' : 'border-gray-300 text-gray-900'} 
                                    hover:border-blue-500 focus:text-black transition duration-150 ease-in-out`} placeholder="Enter your address"
                            />
                            {isValidating && (
                                <div className="absolute right-3 top-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                            {!isValidating && isValid !== null && (
                                <div className="absolute right-3 top-3">
                                    {isValid ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            )}
                            {!isValid && !isValidating && (
                                <p className="mt-1 text-sm text-red-600">The address is invalid. Please check and try again.</p>
                            )}
                        </div>
                        {errors.address && typeof errors.address.message === 'string' && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="flex items-center">
                            <span className="px-3 py-3 bg-gray-200 text-gray-600 rounded-l-lg">+33</span>
                            <input
                                {...register("phoneNumber", {
                                    required: "Phone number is required",
                                    pattern: { value: /^\d{9}$/, message: "Invalid phone number format (9 digits required after the country code)" }
                                })}
                                className={`block w-full px-4 py-3 border rounded-r-lg shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                    ${errors.phoneNumber ? 'border-red-300 text-red-700 placeholder-red-300' : 'border-gray-300 text-gray-900'} 
                                    hover:border-blue-500 focus:text-black transition duration-150 ease-in-out`} placeholder="Enter your phone number"
                            />
                        </div>
                        {errors.phoneNumber && typeof errors.phoneNumber.message === 'string' && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isDirty || isValidating || !isValid}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-150 ease-in-out ${loading || !isDirty || isValidating || !isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    )
}