export const searchCompanies = async (query: string) => {
    const res = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`
    );

    if (!res.ok) throw new Error("Failed to fetch companies");

    return res.json();
};