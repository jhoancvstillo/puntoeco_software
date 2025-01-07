type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-red-500 text-sm text-center">
      {message}
    </div>
  );
}
  


  