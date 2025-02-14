"use client";

import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/environment";
import { Spinner } from "@heroui/react";
import Link from "next/link";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

export function SignIn() {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const payload = {
                username: e.target.username.value,
                password: e.target.password.value
            };

            const res = await fetch(BASE_URL + `/agent/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.body);
                window.location.href = "/s";
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <HoverBorderGradient
            as="div"
            className="max-w-md w-full mx-auto rounded-lg p-4 md:p-8 bg-gradient-to-br from-purple-800 to-pink-800 space-x-2 shadow-lg shadow-pink-700/70"
        >
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Sign in to Temenin Dashboard
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Temenin is a dashboard for Nganterin customer service team.
            </p>
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <input
                        required
                        id="username"
                        name="username"
                        placeholder="elxanny8013"
                        type="username"
                        className="px-4 py-2 rounded-sm bg-transparent border-white border placeholder:text-purple-500"
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <input
                        required
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        className="px-4 py-2 rounded-sm bg-transparent border-white border placeholder:text-purple-500"
                    />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-slate-50 dark:from-slate-50 dark:to-slate-50 to-neutral-600 block dark:bg-slate-800 w-full text-pink-900 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--slate-800)_inset,0px_-1px_0px_0px_var(--slate-800)_inset]"
                    type="submit">
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Spinner color="current" size="sm" className={`${isLoading ? "block" : "hidden"}`} />
                        <p>
                            Sign in &rarr;
                        </p>
                    </div>
                    <BottomGradient />
                </button>
            </form>

            <Link href={"/auth/forgot"} className="text-xs text-right hover:underline">Forgot password?</Link>
        </HoverBorderGradient>
    );
}

const BottomGradient = () => {
    return (<>
        <span
            className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span
            className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>);
};

const LabelInputContainer = ({
    children,
    className
}) => {
    return (
        (<div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>)
    );
};
