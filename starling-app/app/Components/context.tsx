import { createContext, useContext } from "react";

export const AmountContext = createContext<number | undefined>(undefined);

export function useAmountContext() {
    const amountToSavings = useContext(AmountContext);

    if (amountToSavings === undefined) {
        throw new Error("useAmountContext must be used with an AmountContext");
    }

    return amountToSavings;
}