import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  darkMode: boolean;
};

export default function InputField({ id, label, type, value, onChange, darkMode }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={darkMode ? 'text-gray-200' : 'text-green-800'}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className={`${darkMode 
          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500 focus:border-green-500' 
          : 'border-green-200 focus:ring-green-500 focus:border-green-500'}`}
      />
    </div>
  );
}