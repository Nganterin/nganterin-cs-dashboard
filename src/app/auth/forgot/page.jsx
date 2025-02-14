'use client'

import { BASE_URL } from "@/utils/environment"
import { Button, Input, Spinner } from "@heroui/react"
import { useState } from "react"
import { toast } from "sonner"

const Page = () => {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            const res = await fetch(BASE_URL + "/agent/auth/forgot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: e.target.email.value
                })
            })
            if (res.ok) {
                toast.success("Check your email for password reset link")
            } else {
                const data = await res.json()
                toast.error(data.error)
            }
        } catch (err) {
            toast.error(err.message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <form className="w-full max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
                <h1 className="text-3xl font-semibold">
                    Forgot password?
                </h1>
                <p className="text-sm opacity-90">
                    Enter your email address and we will send you a link to reset your password
                </p>
                <Input radius="sm" type="email" placeholder="email@example.com" name="email" required className="" />
                <button
                    className="bg-gradient-to-br relative group/btn from-slate-900 dark:from-slate-900 dark:to-slate-900 to-neutral-600 block dark:bg-slate-800 w-full text-white rounded-lg h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--slate-800)_inset,0px_-1px_0px_0px_var(--slate-800)_inset]"
                    type="submit">
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Spinner color="white" size="sm" className={`${isLoading ? "block" : "hidden"}`} />
                        <p>
                            Reset Password &rarr;
                        </p>
                    </div>
                    <BottomGradient />
                </button>
            </form>
        </div>
    )
}

const BottomGradient = () => {
    return (<>
        <span
            className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span
            className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>);
};

export default Page