export const getCompanyLogo = (domain?: string | null, logo?: string | null) => {
    if (logo) return logo;

    if (domain) {
        return `https://www.google.com/s2/favicons?domain=${domain}`;
    }

    return "/default-company.png";
};