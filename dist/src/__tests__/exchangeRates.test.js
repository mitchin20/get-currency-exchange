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
const axios_1 = __importDefault(require("axios"));
const exchangeRates_1 = require("../services/exchangeRates");
describe("Currency Exchange Rates", () => {
    it("should return the list of exchange rates", () => __awaiter(void 0, void 0, void 0, function* () {
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
        console.log("Mocked axios.get:", axios_1.default.get); // Check what axios.get is
        // Mock the axios.get to return mock data
        axios_1.default.get.mockResolvedValue({
            data: mockData,
            status: 200,
        });
        // Mocking local cache and redis
        const { getCache, setCache, hasCacheKey, } = require("../lib/localCache");
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
        const response = yield (0, exchangeRates_1.currencyExchangeRates)();
        console.log("Response:", response);
        // Check that the response matches the mock data
        expect(response).toEqual(mockData);
        // Verify that the caching functions were called
        expect(setCache).toHaveBeenCalledWith("exchangeRates", mockData, 300);
        expect(redisClient.set).toHaveBeenCalledWith("exchangeRates", JSON.stringify(mockData), { ex: 600 });
    }));
});
