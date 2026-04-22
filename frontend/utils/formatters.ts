export const formatDisplayDate = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (dateMatch) {
        const [, year, month, day] = dateMatch;
        return `${day}/${month}/${year}`;
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const year = parsedDate.getUTCFullYear();

    return `${day}/${month}/${year}`;
};

export const getNumericPrice = (value?: number | string | null) => {
    if (value === undefined || value === null || value === "") {
        return 0;
    }

    const numericPrice = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""));

    return Number.isFinite(numericPrice) ? numericPrice : 0;
};

export const formatPrice = (value?: number | string | null) => {
    if (value === undefined || value === null || value === "") {
        return "-";
    }

    const numericPrice = getNumericPrice(value);

    return numericPrice.toFixed(2);
};
