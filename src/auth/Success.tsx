export default function SuccessScreen({ goToLogin }: any) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-2xl font-semibold mb-4">
                Você se tornou um recrutador 🎉
            </div>

            <div className="text-gray-500 mb-6">
                Faça o seu login com email e senha criados
            </div>

            <button
                onClick={goToLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white 
                cursor-pointer
                px-6 py-2 rounded-xl"
            >
                Entrar
            </button>
        </div>
    );
}