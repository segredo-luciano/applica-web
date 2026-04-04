import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type LoginFormProps = {
  switchToRegister: () => void;
};

export default function LoginForm({ switchToRegister }: LoginFormProps) {
  const navigate = useNavigate();

  const { setIsAuthenticated, setRecruiter } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      const data = await loginUser({
        email,
        password,
      });

      // console.log(data)
      localStorage.setItem("token", data.token);

      setIsAuthenticated(true);
      setRecruiter(data.recruiter)
      // localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/recrutador");
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false)
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div>
        <div className="text-xl font-bold text-blue-900">Olá recrutador, </div>
        <div className="text-xl font-bold mb-4 text-blue-900">que bom tê-lo por aqui!</div>

        <div className="grid justify-items-center">
          <input onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            className="input outline-none focus:outline-none focus:ring-0 w-1/2 border-2 rounded-xl p-2 border-blue-100" />
          <input onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha" type="password" 
            className="input outline-none focus:outline-none focus:ring-0 mt-8 w-1/2 border-2 rounded-xl p-2 border-blue-100" />
        </div>

        {loading ? (
          <div className="justify-center flex space-x-1 mt-6">
              <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )
        :
        (          
        <button onClick={() => handleLogin()}
          className="btn-primary mt-6 w-24 
            text-blue-900 border-2 rounded-xl border-blue-900
            cursor-pointer
            transition
            hover:bg-blue-900
            hover:text-white 
            motion-safe:hover:-translate-x-0.5">Login</button>
        )}
      </div>

      <div className="mt-auto text-sm text-center pb-6">
        Ainda não tem uma conta?{" "}
        <span
          className="text-blue-900 font-bold 
          cursor-pointer
          hover:underline"
          onClick={switchToRegister}
        >
          Comece por aqui
        </span>
      </div>
    </div>
  );
}