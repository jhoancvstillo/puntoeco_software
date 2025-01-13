import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  UserCheck,
  DollarSign,
  Settings2,
} from "lucide-react";

import { ActivePage } from "@/pages/WelcomePage";

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  action: ActivePage;
  subItems?: { label: string; action: ActivePage }[];
}

export const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", action: "dashboard" },
  {
    icon: Package,
    label: "Gestion",
    action: "combustible",
    subItems: [
      { label: "Gestión de Combustible", action: "combustible" },
      { label: "Gestión de Fardos", action: "fardos" },
      { label: "Gestión de Vertedero", action: "vertedero" },
    ],
  },
  {
    icon: Warehouse,
    label: "Generar Certificados",
    action: "pesaje",
    subItems: [
      { label: "Generar Pesaje", action: "pesaje" },
      { label: "Generar Cotizaciones", action: "cotizacion" },
      { label: "Generar DF", action: "disposicionfinal" },
    ],
  },

  { icon: Warehouse, label: "Inventario de Almacén", action: "products" },
  {
    icon: Users,
    label: "Recursos Humanos",
    action: "trabajadores",
  },
  { icon: UserCheck, label: "Gestión de Clientes", action: "clientes" },
  {
    icon: DollarSign,
    label: "Finanzas",
    action: "finanzas",
  },
];

export const footerItems: MenuItem[] = [
  { icon: Settings2, label: "Configuración", action: "configuracion" },
];
