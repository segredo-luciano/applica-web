import { useEffect, useState } from "react";
import { useCompanySearch } from "../../hooks/useCompanySearch";
import { getCompanyLogo } from "../../utils/getCompanyLogo";
import type { Company } from "../../types/company";

type Props = {
  onSelect: (company: Company) => void;
};

export default function CompanyAutocomplete({ onSelect }: Props) {
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { companies, loading } = useCompanySearch(query);

    // useEffect(() => {
    //     if(query.length == 0) setShowDropdown(false)
    // }, [query])

    return (
        <div className="relative mt-2 w-full">
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Empresa"
            className="input outline-none focus:outline-none focus:ring-0 w-1/2 border-2 rounded-xl p-2 border-blue-100"
        />

        {(showDropdown && query.length > 0) && (
            <div className="absolute left-0 w-full bg-white border mt-1 rounded-lg shadow max-h-60 overflow-y-auto z-50">

            {loading && (
                <div className="p-2 text-sm text-gray-500">
                Procurando...
                </div>
            )}

            {!loading && companies.map((c) => (
                <div
                key={c.domain ?? c.name}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                    setQuery(c.name);
                    onSelect(c);
                    setShowDropdown(false);
                }}
                >
                <img
                    src={getCompanyLogo(c.domain, c.logo)}
                    className="w-5 h-5"
                    onError={(e) => {
                    e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
                    }}
                />

                <span>{c.name}</span>
                </div>
            ))}

            {!loading && query.length > 2 && (
                <div
                className="p-2 text-blue-600 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => {
                    onSelect({ name: query, domain: null });
                    setShowDropdown(false);
                }}
                >
                Escolher "{query}" manualmente
                </div>
            )}
            </div>
        )}
        </div>
    );
}