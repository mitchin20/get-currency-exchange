import { Request, Response } from "express";
import { currencyExchangeRates } from "../services/exchangeRates";

export const getCurrencyExchangeRates = async (req: Request, res: Response) => {
    try {
        const data = await currencyExchangeRates();
        res.status(200).json({
            success: true,
            data,
            error: null,
            message: "Exchange rates fetched successfully",
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error",
                error: error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error",
                error: "Unknown error",
            });
        }
    }
};
