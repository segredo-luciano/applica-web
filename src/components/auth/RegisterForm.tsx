import { useState } from "react";
import CompanyAutocomplete from "./CompanyAutocomplete";
import type { Company } from "../../types/company";
import { registerUser } from "../../services/auth.service";

type Props = {
  switchToLogin: () => void;
};

export default function RegisterForm({ switchToLogin }: Props) {
    const [company, setCompany] = useState<Company | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordMismatch =
    password !== confirmPassword &&
    password.length > 0 &&
    confirmPassword.length > 0;

    const handleRegister = async () => {
        if(!company) {
            alert('Selecione uma empresa!')
            return;
        }

        if(!email) return;
        if (password !== confirmPassword) return;        

        try {
            setLoading(true);

            const data = await registerUser({
                name,
                email,
                password,
                company_name: company.name,
                company_domain: company.domain,
            });

            console.log("User created:", data);

        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
      <div className="text-xl font-bold mb-4 text-blue-600">Precisamos de poucos dados para prosseguir...</div>

        <div className="grid justify-items-center">          
            <input onChange={(e) => setName(e.target.value)}
                placeholder="Nome" className="input outline-none focus:outline-none focus:ring-0 w-1/2 border-2 rounded-xl p-2 border-blue-100" />
            <input onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" className="input outline-none focus:outline-none focus:ring-0 mt-2 w-1/2 border-2 rounded-xl p-2 border-blue-100" />
            <CompanyAutocomplete onSelect={setCompany} />

            <br />            
            <input onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha" className={`input outline-none focus:outline-none focus:ring-0 mt-2 
                w-1/2 border-2 rounded-xl p-2 
                ${passwordMismatch ? "border-red-200" : "border-blue-100"}`} />
            <input onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar senha" className={`input outline-none focus:outline-none focus:ring-0 
                mt-2 w-1/2 border-2 rounded-xl p-2 
                ${passwordMismatch ? "border-red-200" : "border-blue-100"}`} />
            
            {(passwordMismatch) && (
                <div className="flex justify-center">                    
                    <div className="text-red-600 text-xs">
                        As senhas não batem
                    </div>                    
                </div>
            )}
        </div>

        {company && (
            <p className="text-sm mt-2 text-gray-600">
                Empresa escolhida: {company.name}
            </p>
        )}

      <button onClick={() => handleRegister}
            className="btn-primary mt-4 min-w-56
                bg-blue-600 text-white border-2 rounded-xl border-blue-600
                cursor-pointer
                transition
                hover:text-blue-600
                hover:bg-white 
                motion-safe:hover:-translate-x-0.5">
        Me tornar um recrutador!
      </button>

      <div className="mt-6 text-sm text-center">
        Já é um recrutador no Applica?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={switchToLogin}
        >
          Login
        </span>
      </div>
    </>
  );
}