"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyExchangeRates = void 0;
const exchangeRates_1 = require("../services/exchangeRates");
const getCurrencyExchangeRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, exchangeRates_1.currencyExchangeRates)();
        res.status(200).json({
            success: true,
            data,
            error: null,
            message: "Exchange rates fetched successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error",
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error",
                error: "Unknown error",
            });
        }
    }
});
exports.getCurrencyExchangeRates = getCurrencyExchangeRates;
