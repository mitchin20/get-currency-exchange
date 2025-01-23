// Mock the modules
jest.mock("axios");
jest.mock("../lib/localCache", () => ({
    getCache: jest.fn(),
    setCache: jest.fn(),
    hasCacheKey: jest.fn(),
}));
jest.mock("../lib/redis", () => ({
    redisClient: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

import axios from "axios";
import { currencyExchangeRates } from "../services/exchangeRates";

describe("Currency Exchange Rates", () => {
    it("should return the list of exchange rates", async () => {
        // Mock data for the API response
        const mockData = {
            success: true,
            timestamp: 1737479057,
            base: "EUR",
            date: "2024-01-01",
            rates: {
                USD: 1.1234,
                GBP: 0.8901,
                JPY: 110.98,
            },
        };

        console.log("Mocked axios.get:", axios.get); // Check what axios.get is

        // Mock the axios.get to return mock data
        (axios.get as jest.Mock).mockResolvedValue({
            data: mockData,
            status: 200,
        });

        // Mocking local cache and redis
        const {
            getCache,
            setCache,
            hasCacheKey,
        } = require("../lib/localCache");
        getCache.mockReturnValue(null); // No local cache
        setCache.mockReturnValue(undefined); // Mock setting cache
        hasCacheKey.mockReturnValue(false); // No cache key available

        const { redisClient } = require("../lib/redis");
        redisClient.get.mockResolvedValue(null); // No Redis cache

        // Ensure the API_URL is mocked correctly
        process.env.CURRENCY_EXCHANGE_URL =
            "https://api.exchangeratesapi.io/v1/latest";
        process.env.CURRENCY_EXCHANGE_KEY = "mockApiKey";

        console.log("Before calling currencyExchangeRates");
        const response = await currencyExchangeRates();
        console.log("Response:", response);

        // Check that the response matches the mock data
        expect(response).toEqual(mockData);

        // Verify that the caching functions were called
        expect(setCache).toHaveBeenCalledWith("exchangeRates", mockData, 300);
        expect(redisClient.set).toHaveBeenCalledWith(
            "exchangeRates",
            JSON.stringify(mockData),
            { ex: 600 }
        );
    });
});
