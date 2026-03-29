import { useEffect, useState } from "react"
import { searchCompanies } from "../services/clearbit.service";
import type { Company } from "../types/company";

export const useCompanySearch = (query: string) => {

    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(query.length < 2) {
            setCompanies([]);
            return;
        }
    

        const timeout = setTimeout(async() => {
            try {
                setLoading(true);
                const data = await searchCompanies(query);
                setCompanies(data);
            } catch(err) {
                console.error(err);
                setCompanies([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return { companies, loading };
}