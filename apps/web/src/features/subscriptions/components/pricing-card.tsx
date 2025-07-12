import { Button } from "@designr/ui/components/button";
import React from "react";

type Plan = {
    name: string;
    discretion: string;
    features: string[];
    price: {
        monthly: number;
        annually: number;
    };
    highlight?: boolean;
};

type Props = {
    plan: Plan;
    billingCycle: "monthly" | "annually";
    onSelect?: () => Promise<void>;
    isCurrent?: boolean
};

export const PlanCard = ({ plan, billingCycle, onSelect, isCurrent }: Props) => {
    const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.annually;

    return (
        <section className="flex flex-col w-full max-w-sm p-6 space-y-6 bg-white rounded-lg shadow-md">
            {/* Price */}
            <div className="flex-shrink-0">
                <span className={`text-4xl font-medium tracking-tight ${plan.highlight ? "text-green-600" : ""}`}>
                    ₦{price.toLocaleString()}
                </span>
                <span className="text-gray-400">{billingCycle === "monthly" ? "/month" : "/year"}</span>
            </div>

            {/* Name and Description */}
            <div className="flex-shrink-0 pb-6 space-y-2 border-b">
                <h2 className="text-2xl font-normal">{plan.name}</h2>
                <p className="text-sm text-muted-foreground">{plan.discretion}</p>
            </div>

            {/* Features */}
            <ul className="flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                        <svg
                            className="w-6 h-6 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="ml-3 text-base font-medium">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Button */}
            <div className="flex-shrink-0 pt-4">
                <Button
                    variant={isCurrent ? "secondary" : plan.highlight ? "default" : 'outline'}
                    className={`inline-flex items-center justify-center w-full px-4 py-2 transition-colors border rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 `}
                    onClick={onSelect}
                    disabled={isCurrent}
                >
                    {isCurrent ? "Current Plan" : `Get ${plan.name}`}
                </Button>
            </div>
        </section>
    );
};
