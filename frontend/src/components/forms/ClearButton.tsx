import {X} from "lucide-react"


interface ClearButtonProps {
    onClick: () => void
}


export const ClearButton = ({ onClick }: ClearButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-1 top-1/2 -translate-y-1/2"
    >
      <X className="h-4 w-4" />
    </button>
);