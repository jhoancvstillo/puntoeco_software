"use client"

import React, { useState } from 'react'
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
} from "@/components/ui/sidebar"

import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Warehouse, 
  Users, 
  UserCheck, 
  DollarSign,
  Settings, 
  LogOut,
  Recycle,
  CreditCard,
  LineChart
} from 'lucide-react'
import { ActivePage } from '@/pages/WelcomePage'
import { SettingsPopup } from '@/components/Settings/Settings'
import LogoutConfirmDialog from '@/components/logout/LogoutConfirmDialog'
import { useNavigate } from 'react-router-dom'

interface MenuItem {
  icon: React.ElementType;
  label: string;
  action: ActivePage;
  subItems?: { label: string; action: ActivePage }[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', action: 'dashboard' },
  { icon: Package, label: 'Gestión de Fardos', action: 'bales' },
  { icon: Warehouse, label: 'Administración de Tolvas', action: 'hoppers' },
  { icon: Truck, label: 'Control de Flotas', action: 'fleet' },
  { icon: Warehouse, label: 'Inventario de Almacén', action: 'inventory' },
  { icon: Users, label: 'Recursos Humanos', action: 'hr' },
  { icon: UserCheck, label: 'Gestión de Clientes', action: 'clients' },
  { 
    icon: DollarSign, 
    label: 'Finanzas', 
    action: 'finance',
    subItems: [
      { label: 'Transacciones', action: 'transactions' },
      { label: 'Flujo de Caja', action: 'cashflow' }
    ]
  },
]

const footerItems: MenuItem[] = [
  { icon: Settings, label: 'Configuración', action: 'settings' },
  { icon: LogOut, label: 'Cerrar sesión', action: 'logout' },
]

interface PuntoEcoSidebarProps {
  setActivePage: (page: ActivePage) => void;
}

const PuntoEcoSidebar: React.FC<PuntoEcoSidebarProps> = ({ setActivePage }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  //const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
  }

  const handleLogoutClick = () => {
    setIsLogoutOpen(true)
  }

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

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
                  <span className="text-xs text-muted-foreground">Gestión de Reciclaje</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item, index) => (
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
                              {subItem.label === 'Transacciones' ? (
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
            {footerItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton 
                  className="w-full justify-start"
                  onClick={item.action === 'settings' ? handleSettingsClick : item.action === 'logout' ? handleLogoutClick : () => setActivePage(item.action)}
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
          handleLogout()
          setIsLogoutOpen(false)
        }} 
      />   
      <SettingsPopup open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  )
}

export default PuntoEcoSidebar