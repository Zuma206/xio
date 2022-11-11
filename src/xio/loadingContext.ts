import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type LoadingState = [number, Dispatch<SetStateAction<number>>];

export const LoadingContext = createContext<LoadingState>([0, () => {}]);

export const useLoading = (): [() => void, () => void, number, () => void] => {
    const [loading, setLoading] = useContext(LoadingContext);
    return [
        () => {
            setLoading((loading) => loading + 1);
        },
        () => {
            setLoading((loading) => (loading > 0 ? loading - 1 : 0));
        },
        loading,
        () => {
            setLoading(0);
        },
    ];
};
