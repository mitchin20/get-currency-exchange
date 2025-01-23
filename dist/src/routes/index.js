"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exchangeRatesController_1 = require("../controllers/exchangeRatesController");
const router = express_1.default.Router();
router.get("/exchange-rates", exchangeRatesController_1.getCurrencyExchangeRates);
exports.default = router;
