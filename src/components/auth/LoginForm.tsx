type LoginFormProps = {
  switchToRegister: () => void;
};

export default function LoginForm({ switchToRegister }: LoginFormProps) {
  return (
    <>
      <div className="text-xl font-bold text-blue-900">Olá recrutador, </div>
      <div className="text-xl font-bold mb-4 text-blue-900">que bom tê-lo por aqui!</div>

        <div className="grid justify-items-center">
            <input placeholder="Email" className="input outline-none focus:outline-none focus:ring-0 w-1/2 border-2 rounded-xl p-2 border-blue-100" />
            <input placeholder="Senha" type="password" className="input outline-none focus:outline-none focus:ring-0 mt-8 w-1/2 border-2 rounded-xl p-2 border-blue-100" />
        </div>

      <button className="btn-primary mt-6 w-24 
                text-blue-900 border-2 rounded-xl border-blue-900
                cursor-pointer
                transition
                hover:bg-blue-900
                hover:text-white 
                motion-safe:hover:-translate-x-0.5">Login</button>

      <div className="mt-6 text-sm text-center">
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
    </>
  );
}