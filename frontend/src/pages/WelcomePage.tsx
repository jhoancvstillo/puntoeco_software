import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Gestion from "./Gestion";
import PuntoSidebar from "./Sidebar";
import Transacciones from "./Finances/Transacciones";
import Inventory from "@/pages/Inventory/Inventory";
import { RHList } from "./HR/RHList/RHList";
import { Separator } from "@/components/ui/separator";
import ClientManagement from "./Clients/ClientManagement";
import Pesaje from "./Pesaje/Pesaje";
import Cotizacion from "./Cotizacion/Cotizacion";
import Vertedero from "./Vertedero/Vertedero";
import GestionCombustible from "./GestionCombustible/GestionCombustible";
import CertificadoDisposicionFinal from "./DisposicionFinal/main";
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ExportarDocumentosForm } from "./DisposicionFinal/components/ExportarDocumentosForm";
import InventoryForm from "./Inventory/components/InventoryForm";
import { ButtonTitle } from "./ButtonTitle";
import { TransactionForm } from "./Finances/components/TransactionForm";

import { useTableStore } from "./tableStore";


interface User {
  id: number;
  username: string;
  email: string;
}

export type ActivePage =
  | "dashboard"
  | "fardos"
  | "trabajadores"
  | "clientes"
  | "finanzas"
  | "configuracion"
  | "logout"
  | "combustible"
  | "vertedero"
  | "pesaje"
  | "cotizacion"
  | "disposicionfinal"
  | "products";

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const navigate = useNavigate();
  const [title, setTitle] = useState("Dashboard");
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);
  const toggleRefreshFinance = useTableStore((state) => state.toggleRefreshTable1);
  const toggleRefreshInventory = useTableStore((state) => state.toggleRefreshTable2);
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const pageTitles: Record<ActivePage, string> = {
      dashboard: "Dashboard",
      fardos: "Gestión de Fardos",
      vertedero: "Gestión de Vertedero",
      products: "Inventario de Almacén",
      trabajadores: "Lista de Trabajadores",
      clientes: "Gestión de Clientes",
      finanzas: "Finanzas",
      configuracion: "Configuración",
      logout: "Cerrar Sesión",
      combustible: "Gestión de Combustible",
      pesaje: "Certificados de Pesaje",
      cotizacion: "Generar Cotización",
      disposicionfinal: "Generar Certificado de Disposición Final",
    };
    setTitle(pageTitles[activePage]);
  }, [activePage]);

  if (!user) {
    return null;
  }

  // fetch the items

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard key="dashboard" />;
      case "fardos":
        return <Gestion key="bales" />;
      case "clientes":
        return <ClientManagement key="clients" />;
      case "finanzas":
        return <Transacciones key="transactions" />;
      case "products":
        return <Inventory key="inventory" />;
      case "trabajadores":
        return <RHList key="rh_list" />;
      case "pesaje":
        return <Pesaje key="pesaje" />;
      case "cotizacion":
        return <Cotizacion key="cotizacion" />;
      case "vertedero":
        return <Vertedero key="vertedero" />;
      case "combustible":
        return <GestionCombustible key="gestionCombustible" />;
      case "disposicionfinal":
        return <CertificadoDisposicionFinal key="disposicionfinal" />;
      default:
        return <Dashboard key="default" />;
    }
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div>
        <PuntoSidebar setActivePage={setActivePage} />
      </div>
      <div className="flex-1 overflow-hidden">
        {activePage && (
          <Card className={`m-2 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between p-3">
              <div className="space-y-1.5 flex">
                <h2
                  className={`text-3xl font-bold ml-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {activePage === "disposicionfinal" && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Exportar Documentos</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Exportar Documentos</DialogTitle>
                        <DialogDescription>
                          Ingrese los detalles para exportar los documentos.
                        </DialogDescription>
                      </DialogHeader>
                      <ExportarDocumentosForm />
                    </DialogContent>
                  </Dialog>
                )}
                {activePage === "finanzas" && (
                  <ButtonTitle
                    open={open}
                    setOpen={setOpen}
                    buttonName="Agregar Transacción"
                    title="Añadir transacción"
                    description="Ingrese los detalles de la transacción."
                  >
                    <TransactionForm onChange={setOpen} onClick={toggleRefreshFinance} />
                  </ButtonTitle>
                )}
                {activePage === "products" && (
                  <ButtonTitle
                    open={open}
                    setOpen={setOpen}
                    buttonName="Transacción"
                  >
                    <InventoryForm onChange={setOpen} onClick={toggleRefreshInventory} />
                  </ButtonTitle>
                )}
                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  size="icon"
                  className={`${
                    darkMode
                      ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  aria-label={
                    darkMode ? "Activar modo claro" : "Activar modo oscuro"
                  }
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            <Separator className={darkMode ? "bg-gray-700" : "bg-gray-200"} />
          </Card>
        )}
        <div className="p-4">
          <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden">
            {renderActivePage()}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

