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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyExchangeRates = void 0;
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../lib/redis");
const localCache_1 = require("../lib/localCache");
const ttl = 300;
const API_URL = `${process.env.CURRENCY_EXCHANGE_URL}?access_key=${process.env.CURRENCY_EXCHANGE_KEY}`;
const currencyExchangeRates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for local cache
        const localCache = (0, localCache_1.getCache)("exchangeRates");
        if (localCache) {
            return localCache;
        }
        // If local cache is not available, check for redis cache
        const redisCache = yield redis_1.redisClient.get("exchangeRates");
        if (redisCache) {
            const parsedRedisData = JSON.parse(redisCache);
            // Re-cache data to local cache
            if (!(0, localCache_1.hasCacheKey)("exchangeRates")) {
                (0, localCache_1.setCache)("exchangeRates", parsedRedisData, ttl);
            }
            return parsedRedisData;
        }
        // API call
        const response = yield axios_1.default.get(API_URL);
        if (response.status !== 200) {
            throw new Error("Failed to fetch exchange rates");
        }
        // Cache data to local
        (0, localCache_1.setCache)("exchangeRates", response.data, ttl);
        // Cache data to redis
        yield redis_1.redisClient.set("exchangeRates", JSON.stringify(response.data), {
            ex: 600,
        });
        return response.data;
    }
    catch (error) {
        console.log("Fetch exchange rates error: ", error);
        throw error;
    }
});
exports.currencyExchangeRates = currencyExchangeRates;
