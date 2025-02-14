"use client";

import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/environment";
import { Spinner } from "@heroui/react";
import Link from "next/link";

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
        (<div
            className="max-w-md w-full mx-auto rounded-sm p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Sign in to Temenin Dashboard
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Temenin is a dashboard for Nganterin customer service team.
            </p>
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="elxanny8013" type="username" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit">
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Spinner color="white" size="sm" className={`${isLoading ? "block" : "hidden"}`} />
                        <p>
                            Sign in &rarr;
                        </p>
                    </div>
                    <BottomGradient />
                </button>
            </form>

            <Link href={"/auth/forgot"} className="text-xs text-right hover:underline">Forgot password?</Link>
        </div>)
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
