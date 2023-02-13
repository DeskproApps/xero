import {
  parseJsonErrorMessage,
  currencyCodeToSymbol,
  capitalizeFirstLetter,
} from "../../src/utils/utils";

describe("utils", () => {
  test("parseJsonErrorMessage", () => {
    const error = {
      status: 400,
      message: "error message",
    };
    expect(parseJsonErrorMessage(JSON.stringify(error))).toBe(
      `Status: 400 \n Message: error message`
    );
  });

  test("currencyCodeToSymbol", () => {
    expect(currencyCodeToSymbol("AUD")).toBe("$");
    expect(currencyCodeToSymbol("NZD")).toBe("$");
    expect(currencyCodeToSymbol("USD")).toBe("$");
    expect(currencyCodeToSymbol("GBP")).toBe("£");
    expect(currencyCodeToSymbol("EUR")).toBe("€");
    expect(currencyCodeToSymbol("CRC")).toBe("₡");
    expect(currencyCodeToSymbol("ILS")).toBe("₪");
    expect(currencyCodeToSymbol("INR")).toBe("₹");
    expect(currencyCodeToSymbol("JPY")).toBe("¥");
    expect(currencyCodeToSymbol("KRW")).toBe("₩");
    expect(currencyCodeToSymbol("NGN")).toBe("₦");
    expect(currencyCodeToSymbol("PHP")).toBe("₱");
    expect(currencyCodeToSymbol("PLN")).toBe("zł");
    expect(currencyCodeToSymbol("PYG")).toBe("₲");
    expect(currencyCodeToSymbol("THB")).toBe("฿");
    expect(currencyCodeToSymbol("UAH")).toBe("₴");
    expect(currencyCodeToSymbol("VND")).toBe("₫");
  });

  test("capitalizeFirstLetter", () => {
    expect(capitalizeFirstLetter("test")).toBe("Test");
    expect(capitalizeFirstLetter("TEST")).toBe("Test");
  });
});
