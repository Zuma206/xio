import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useLoading } from "./loadingContext";

export interface ExtendedError extends Error {
    title?: string;
    code?: string;
}

export type ErrorState = [
    ExtendedError | null,
    Dispatch<SetStateAction<ExtendedError | null>>
];

export const ErrorContext = createContext<ErrorState>([null, () => {}]);

export const useError = (
    errorTitle: string | undefined = undefined
): [(err: ExtendedError) => void, () => void, ExtendedError | null] => {
    const [errorData, setError] = useContext(ErrorContext);
    const [, , , stopLoading] = useLoading();
    return [
        (err: ExtendedError) => {
            err.title = errorTitle ?? "";
            setError(err);
            stopLoading();
        },
        () => {
            setError(null);
        },
        errorData,
    ];
};
