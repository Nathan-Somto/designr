"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@designr/ui/components/button";
import { Input } from "@designr/ui/components/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@designr/ui/components/scroll-area";
import { authClient } from "@designr/auth/client";
import { LINKS } from "#/constants/links";
import { fetchCallback } from "../utils";
import ErrorToast from "./error-toast";
//import { fetchCallback } from "@/lib/utils";

export function AuthPage({ mode = "signin" }: { mode?: "signin" | "signup" }) {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    const priceId = searchParams.get("priceId");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    return (
        <div className="min-h-[100dvh] h-[100dvh] w-full bg-primary/10 flex items-center justify-center px-4 py-12">
            <div className="bg-white shadow-lg rounded-[12px] w-full max-w-5xl h-[90vh] flex overflow-hidden">

                {/* Left (Form) */}
                <ScrollArea className="w-full md:w-1/2 p-6 md:p-10">
                    <ErrorToast error={error} />
                    <div className="flex justify-center">
                        <Image
                            src="/logo.svg"
                            className="size-20"
                            width={300}
                            height={300}
                            alt="logo"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {mode === "signin"
                            ? "Sign in to your account"
                            : "Create your account"}
                    </h2>

                    {/* Your existing form code */}
                    {/* Just replace the outer wrappers for form to avoid duplication */}
                    <div className="mt-8">
                        <div className="space-y-6">
                            {mode === "signup" && (
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <div className="mt-1">
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            onChange={(e) => setName(e.currentTarget.value)}
                                            value={name}
                                            required
                                            maxLength={50}
                                            className="appearance-none h-10 rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.currentTarget.value)}
                                        type="email"
                                        autoComplete="email"
                                        required
                                        maxLength={50}
                                        className="appearance-none h-10 rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-xs underline">
                                        forgot password?
                                    </Link>
                                </div>
                                <div className="mt-1">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.currentTarget.value)}
                                        autoComplete={
                                            mode === "signin" ? "current-password" : "new-password"
                                        }
                                        required
                                        minLength={8}
                                        maxLength={100}
                                        className="appearance-none h-10 rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>


                            <div>
                                <Button
                                    type="submit"
                                    className="w-full mt-2 mb-3"
                                    disabled={isPending}
                                    onClick={async () => {
                                        if (mode === "signin") {
                                            await authClient.signIn.email(
                                                {
                                                    email,
                                                    password,
                                                    callbackURL: LINKS.DASHBOARD,
                                                },
                                                fetchCallback({
                                                    setError,
                                                    setIsPending
                                                })

                                            );
                                        } else {
                                            await authClient.signUp.email(
                                                {
                                                    email,
                                                    password,
                                                    name,
                                                    callbackURL: LINKS.DASHBOARD,
                                                },
                                                fetchCallback({
                                                    setError,
                                                    setIsPending
                                                })
                                            );
                                        }
                                    }}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            Loading...
                                        </>
                                    ) : mode === "signin" ? (
                                        "Sign in"
                                    ) : (
                                        "Sign up"
                                    )}
                                </Button>

                                <Button
                                    disabled={isPending}
                                    onClick={async () => {
                                        await authClient.signIn.social({
                                            provider: "google",
                                            callbackURL: LINKS.DASHBOARD,
                                        },
                                            fetchCallback({
                                                setError,
                                                setIsPending
                                            })
                                        );
                                    }}
                                    variant={'secondary'}
                                    className="w-full mt-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 326667 333333"
                                        shapeRendering="geometricPrecision"
                                        textRendering="geometricPrecision"
                                        imageRendering="optimizeQuality"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    >
                                        <path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4" />
                                        <path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853" />
                                        <path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04" />
                                        <path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335" />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-muted-foreground">
                                        {mode === "signin"
                                            ? "New to our platform?"
                                            : "Already have an account?"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    asChild
                                    variant={'outline'}
                                >
                                    <Link
                                        href={
                                            `${mode === "signin"
                                                ?
                                                LINKS.SIGNUP
                                                : LINKS.LOGIN
                                            }${redirect ?
                                                `?redirect=${redirect}` : ""
                                            }
                                            ${priceId ?
                                                `&priceId=${priceId}` : ""}`
                                        }
                                        className="w-full"
                                    >
                                        {mode === "signin"
                                            ? "Create an account"
                                            : "Sign in to existing account"}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="hidden md:block w-1/2 h-full">
                    <Image
                        src={'/designer-lady.avif'}
                        alt="Graphic design artist with her digital sketch pad"
                        width={800}
                        height={800}
                        className="object-cover w-full h-full rounded-r-[12px]"
                    />
                </div>
            </div>
        </div>
    );
}