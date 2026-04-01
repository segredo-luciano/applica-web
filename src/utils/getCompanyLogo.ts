export const getCompanyLogo = (domain?: string | null, logo?: string | null) => {
    if (logo) return logo;

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
};