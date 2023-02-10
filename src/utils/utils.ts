export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

export const buttonLabels = [
  {
    submitting: "Creating...",
    submit: "Create",
    id: "create",
  },
  {
    submitting: "Saving...",
    submit: "Save",
    id: "edit",
  },
];

export const currencyCodeToSymbol = (currencyCode: string) => {
  switch (currencyCode) {
    case "AUD":
      return "$";
    case "NZD":
      return "$";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    case "CRC":
      return "₡";
    case "ILS":
      return "₪";
    case "INR":
      return "₹";
    case "JPY":
      return "¥";
    case "KRW":
      return "₩";
    case "NGN":
      return "₦";
    case "PHP":
      return "₱";
    case "PLN":
      return "zł";
    case "PYG":
      return "₲";
    case "THB":
      return "฿";
    case "UAH":
      return "₴";
    case "VND":
      return "₫";
    default:
      return "$";
  }
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
