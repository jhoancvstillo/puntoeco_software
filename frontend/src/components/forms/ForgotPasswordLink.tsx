interface ForgotPasswordLinkProps {
  darkMode: boolean;
}

export default function ForgotPasswordLink({ darkMode }: ForgotPasswordLinkProps) {
    return (
      <div className="text-center pb-4">
        <a href="#" className={`text-sm ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} hover:underline`}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    );
  }