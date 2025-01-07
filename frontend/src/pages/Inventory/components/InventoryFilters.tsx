import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Categoria } from "../types/inventory";

interface InventoryFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  categories: Categoria[];
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <div className="flex space-x-4 items-end">
      <div className="flex-1">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          type="text"
          placeholder="Buscar por nombre o categoría"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <div className="w-[200px]">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={selectedCategory?.toString() || "all"}
          onValueChange={(value) => onCategoryChange(value === "all" ? null : parseInt(value))}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InventoryFilters;

