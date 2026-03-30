import { useState } from "react";
import CompanyAutocomplete from "./CompanyAutocomplete";
import type { Company } from "../types/company";
import { registerUser } from "../services/auth.service";

type Props = {
  switchToLogin: () => void;
  onSuccess: () => void;
};

export default function RegisterForm({ switchToLogin, onSuccess }: Props) {
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
        if(password === '') {
            alert('Favor criar uma senha')
            return;
        }
        if (password !== confirmPassword) {
            alert('As senhas devem bater')
            return
        };        


        try {
            console.log('creating user')
            setLoading(true);

            const data = await registerUser({
                name,
                email,
                password,
                company: company.name,
                company_domain: company.domain,
            });

            onSuccess();

        } catch (err: any) {
            // alert('Erro no servidor: '+ err.code)            
            console.error(err);
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
            {company && (
                <p className="text-sm mt-2 text-gray-600">
                    Empresa escolhida: {company.name}
                </p>
            )}

            <br />            
            <input onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha" type="password"
                className={`input outline-none focus:outline-none focus:ring-0 mt-2 
                w-1/2 border-2 rounded-xl p-2 
                ${passwordMismatch ? "border-red-200" : "border-blue-100"}`} />
            <input onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar senha" type="password"
                className={`input outline-none focus:outline-none focus:ring-0 
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

        <button onClick={() => handleRegister()}
            disabled={loading}
            className={`btn-primary mt-4 min-w-56
                ${loading ? 'cursor-not-allowed' :
                `bg-blue-600 text-white border-2 rounded-xl border-blue-600 
                cursor-pointer
                transition
                hover:text-blue-600
                hover:bg-white 
                motion-safe:hover:-translate-x-0.5`}`}>
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <span className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : (
                "Me tornar um recrutador!"
            )}
        </button>

        {!loading ? (
            <div className="mt-6 text-sm text-center">
                Já é um recrutador no Applica?{" "}
                <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={switchToLogin}
                >
                Login
                </span>
            </div>
        ):
        (
            <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                <div className="flex flex-col items-center gap-3">                    
                </div>
            </div>
        )}
    </>
  );
}