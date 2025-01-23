import request from "supertest";
import express from "express";
import { getCurrencyExchangeRates } from "../controllers/exchangeRatesController";
import { currencyExchangeRates } from "../services/exchangeRates";

// Mock the service function
jest.mock("../services/exchangeRates");

const app = express();

// Use the controller in a route
app.get("/exchange-rates", getCurrencyExchangeRates);

describe("GET /exchange-rates", () => {
    it("should return currency exchange rates", async () => {
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

        (currencyExchangeRates as jest.Mock).mockResolvedValue(mockData);

        // Make the request to the endpoint and check the response
        const response = await request(app).get("/exchange-rates");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockData);
        expect(response.body.message).toEqual(
            "Exchange rates fetched successfully"
        );
    });

    it("should return 500 if an error occurs in the service", async () => {
        // Mock the service function to throw an error
        (currencyExchangeRates as jest.Mock).mockRejectedValue(
            new Error("Service Error")
        );

        // Make the request to the endpoint and check the response
        const response = await request(app).get("/exchange-rates");

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Internal Server Error");
        expect(response.body.error).toBe("Service Error");
    });
});
