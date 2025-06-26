import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { 
  Users, 
  Settings, 
  Building, 
  FileText, 
  Calendar,
  User,
  LogOut,
  Palette,
  Award
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';
import LogoEquusID from '../../../public/logo/logo-equusid.svg';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Calendar,
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: Users,
  },
  {
    title: "Equinos",
    url: "/equines",
    icon: User,
  },
  {
    title: "Libretas Sanitarias",
    url: "/health-books",
    icon: FileText,
  },
  {
    title: "Establecimientos",
    url: "/stables",
    icon: Building,
  },
  {
    title: "Traslados",
    url: "/travels",
    icon: Calendar,
  },
  {
    title: "Razas",
    url: "/breeds",
    icon: Award,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <SidebarHeader className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#7D5B47] to-[#9A7B5A]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <img src={LogoEquusID} alt="Logo EquusID" className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white font-['Roboto_Condensed']">EQUUS ID</h2>
            <p className="text-sm text-white/80 font-['Roboto_Condensed']">Backoffice</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-[#7D5B47] uppercase tracking-wider mb-4 font-['Roboto_Condensed']">
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 font-['Roboto_Condensed'] ${
                        location.pathname === item.url
                          ? 'bg-[#7D5B47] text-white shadow-md border-r-4 border-[#9A7B5A]'
                          : 'text-gray-700 hover:bg-[#7D5B47]/10 hover:text-[#7D5B47]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 px-3 py-2 bg-white rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-[#7D5B47] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 font-['Roboto_Condensed']">
                {user?.name} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 font-['Roboto_Condensed']">{user?.profile}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center space-x-2 border-[#7D5B47] text-[#7D5B47] hover:bg-[#7D5B47] hover:text-white transition-colors font-['Roboto_Condensed']"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
