require("dotenv").config();
import axios from "axios";
import { redisClient } from "../lib/redis";
import { getCache, setCache, hasCacheKey } from "../lib/localCache";

const ttl = 300;
const API_URL = `${process.env.CURRENCY_EXCHANGE_URL}?access_key=${process.env.CURRENCY_EXCHANGE_KEY}`;

export const currencyExchangeRates = async () => {
    try {
        // Check for local cache
        const localCache = getCache("exchangeRates");
        if (localCache) {
            return localCache;
        }

        // If local cache is not available, check for redis cache
        const redisCache: string | null = await redisClient.get(
            "exchangeRates"
        );
        if (redisCache) {
            const parsedRedisData = JSON.parse(redisCache);
            // Re-cache data to local cache
            if (!hasCacheKey("exchangeRates")) {
                setCache("exchangeRates", parsedRedisData, ttl);
            }

            return parsedRedisData;
        }

        // API call
        const response = await axios.get(API_URL);

        if (response.status !== 200) {
            throw new Error("Failed to fetch exchange rates");
        }

        // Cache data to local
        setCache("exchangeRates", response.data, ttl);

        // Cache data to redis
        await redisClient.set("exchangeRates", JSON.stringify(response.data), {
            ex: 600,
        });

        return response.data;
    } catch (error) {
        console.log("Fetch exchange rates error: ", error);
        throw error;
    }
};
