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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const exchangeRatesController_1 = require("../controllers/exchangeRatesController");
const exchangeRates_1 = require("../services/exchangeRates");
// Mock the service function
jest.mock("../services/exchangeRates");
const app = (0, express_1.default)();
// Use the controller in a route
app.get("/exchange-rates", exchangeRatesController_1.getCurrencyExchangeRates);
describe("GET /exchange-rates", () => {
    it("should return currency exchange rates", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock API return data
        const mockData = {
            success: true,
            timestamp: 1737479057,
            base: "EUR",
            data: "2024-01-01",
            rates: {
                USD: 1.1234,
                GBP: 0.8901,
                JPY: 110.98,
            },
        };
        exchangeRates_1.currencyExchangeRates.mockResolvedValue(mockData);
        // Make the request to the endpoint and check the response
        const response = yield (0, supertest_1.default)(app).get("/exchange-rates");
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockData);
        expect(response.body.message).toEqual("Exchange rates fetched successfully");
    }));
    it("should return 500 if an error occurs in the service", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the service function to throw an error
        exchangeRates_1.currencyExchangeRates.mockRejectedValue(new Error("Service Error"));
        // Make the request to the endpoint and check the response
        const response = yield (0, supertest_1.default)(app).get("/exchange-rates");
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Internal Server Error");
        expect(response.body.error).toBe("Service Error");
    }));
});
