import express from "express";
import { getCurrencyExchangeRates } from "../controllers/exchangeRatesController";

const router = express.Router();

router.get("/exchange-rates", getCurrencyExchangeRates);

export default router;
