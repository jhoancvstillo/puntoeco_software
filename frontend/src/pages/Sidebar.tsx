"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import { Recycle, CreditCard, LineChart } from "lucide-react";
import { ActivePage } from "@/pages/WelcomePage";
import LogoutConfirmDialog from "@/components/logout/LogoutConfirmDialog";
import { useNavigate } from "react-router-dom";
import Settings from "@/pages/Settings/Settings";
import { getPermissions } from "@/api/users";
import { footerItems, MenuItem, menuItems } from "./MenuItems";

interface PuntoEcoSidebarProps {
  setActivePage: (page: ActivePage) => void;
}

const PuntoEcoSidebar: React.FC<PuntoEcoSidebarProps> = ({ setActivePage }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [filtered, setFiltered] = useState<MenuItem[]>([]);
  const [filteredFooterItems, setFilteredFooterItems] = useState<MenuItem[]>(
    []
  );

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // hacer la interseccion de los permisos con los items del menu considerando subitems

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermissions();
        const data = response.permissions;

        // Filtrar los menuItems según los permisos
        const filteredMenuItems = menuItems
          .map((item) => {
            if (item.subItems) {
              // Filtrar subitems que coincidan con los permisos
              const filteredSubItems = item.subItems.filter((subItem) =>
                data.includes(subItem.action)
              );

              // Si tiene subitems válidos, devolver el ítem con los subitems filtrados
              if (filteredSubItems.length > 0) {
                return { ...item, subItems: filteredSubItems };
              }
            }

            // Si el item principal está en los permisos, incluirlo
            if (data.includes(item.action)) {
              return item;
            }

            // Si no cumple, excluirlo
            return null;
          })
          .filter(Boolean); // Eliminar elementos nulos

        // Filtrar footerItems: incluir siempre "logout" y las intersecciones con los permisos
        const filteredFooterItems = footerItems.filter(
          (item) =>
            item.action === "logout" || // Incluir siempre "logout"
            data.includes(item.action) // Incluir intersecciones con permisos
        );

        // Actualizar estados
        setFiltered(
          filteredMenuItems.filter((item): item is MenuItem => item !== null)
        );
        setFilteredFooterItems(filteredFooterItems);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {}, [filtered]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="w-full justify-start">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Recycle className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Punto Eco</span>
                  <span className="text-xs text-muted-foreground">
                    Gestión de Reciclaje
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filtered.map((item, index) => (
              <SidebarMenuItem key={index}>
                {item.subItems ? (
                  <div>
                    <SidebarMenuButton
                      className="w-full justify-start pl-4"
                      onClick={() => {
                        if (openSubmenu === item.label) {
                          setOpenSubmenu(null);
                        } else {
                          setOpenSubmenu(item.label);
                        }
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4 ml-2" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {openSubmenu === item.label && (
                      <SidebarMenuSub>
                        {item.subItems.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                setActivePage(subItem.action);
                                setOpenSubmenu(null);
                              }}
                            >
                              {subItem.label === "Transacciones" ? (
                                <CreditCard className="mr-2 h-4 w-4" />
                              ) : (
                                <LineChart className="mr-2 h-4 w-4" />
                              )}
                              {subItem.label}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </div>
                ) : (
                  <SidebarMenuButton
                    className="w-full justify-start pl-4"
                    onClick={() => setActivePage(item.action)}
                  >
                    <item.icon className="mr-2 h-4 w-4 ml-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {filteredFooterItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  className="w-full justify-start"
                  onClick={
                    item.action === "configuracion"
                      ? handleSettingsClick
                      : item.action === "logout"
                      ? handleLogoutClick
                      : () => setActivePage(item.action)
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <LogoutConfirmDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onConfirm={() => {
          handleLogout();
          setIsLogoutOpen(false);
        }}
      />
      <Settings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
};

export default PuntoEcoSidebar;
