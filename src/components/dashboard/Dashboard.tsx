import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, FileText, Building, Calendar } from 'lucide-react';
import { userService } from '@/services/userService';
import { healthBookService } from '@/services/healthBookService';
import { stableService } from '@/services/stableService';
import { travelService } from '@/services/travelService';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalVeterinarians, setTotalVeterinarians] = useState<number | null>(null);
  const [totalEquines, setTotalEquines] = useState<number | null>(null);
  const [totalHealthBooks, setTotalHealthBooks] = useState<number | null>(null);
  const [totalStables, setTotalStables] = useState<number | null>(null);
  const [enrolledEquines, setEnrolledEquines] = useState<number | null>(null);

  useEffect(() => {
    // Total usuarios y veterinarios
    userService.getUsers(0, 1).then(res => {
      setTotalUsers(res.totalElements);
      // Para veterinarios: traer todos los usuarios y filtrar
      userService.getUsers(0, 1000).then(all => {
        setTotalVeterinarians(all.content.filter((u: any) => u.veterinarianCollegeId && u.veterinarianCollegeId !== '').length);
      });
    });
    // Total equinos y enrolados
    travelService.getEquinesByOwner(0).then(equines => {
      setTotalEquines(equines.length);
      setEnrolledEquines(equines.filter((e: any) => e.irisEnrolled === true || e.irisEnrolled === 1).length);
    });
    // Total libretas sanitarias
    healthBookService.getHealthBooks(0, 1).then(res => setTotalHealthBooks(res.totalElements));
    // Total establecimientos
    stableService.getStables(0, 1).then(res => setTotalStables(res.totalElements));
  }, []);

  const metrics = [
    {
      title: "Total Usuarios",
      value: totalUsers !== null ? totalUsers.toLocaleString() : '...',
      change: "",
      icon: Users,
      color: "text-[#7D5B47]",
      bgColor: "bg-[#7D5B47]/10",
      description: "Usuarios registrados"
    },
    {
      title: "Veterinarios",
      value: totalVeterinarians !== null ? totalVeterinarians.toLocaleString() : '...',
      change: "",
      icon: User,
      color: "text-[#9A7B5A]",
      bgColor: "bg-[#9A7B5A]/10",
      description: "Profesionales activos"
    },
    {
      title: "Equinos",
      value: totalEquines !== null ? totalEquines.toLocaleString() : '...',
      change: "",
      icon: User,
      color: "text-[#8B6B4F]",
      bgColor: "bg-[#8B6B4F]/10",
      description: "Equinos registrados"
    },
    {
      title: "Libretas Sanitarias",
      value: totalHealthBooks !== null ? totalHealthBooks.toLocaleString() : '...',
      change: "",
      icon: FileText,
      color: "text-[#7D5B47]",
      bgColor: "bg-[#7D5B47]/10",
      description: "Documentos activos"
    },
    {
      title: "Con Biometría",
      value: enrolledEquines !== null ? enrolledEquines.toLocaleString() : '...',
      change: "",
      icon: User,
      color: "text-[#9A7B5A]",
      bgColor: "bg-[#9A7B5A]/10",
      description: "Equinos enrolados"
    },
    {
      title: "Establecimientos",
      value: totalStables !== null ? totalStables.toLocaleString() : '...',
      change: "",
      icon: Building,
      color: "text-[#8B6B4F]",
      bgColor: "bg-[#8B6B4F]/10",
      description: "Establecimientos activos"
    }
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7D5B47] to-[#9A7B5A] bg-clip-text text-transparent font-['Roboto_Condensed']">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 font-['Roboto_Condensed']">Vista general del sistema de gestión equina</p>
        </div>
        <div className="text-sm text-gray-500 font-['Roboto_Condensed'] bg-white px-4 py-2 rounded-lg shadow-sm">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 font-['Roboto_Condensed']">
                {metric.title}
              </CardTitle>
              <div className={`p-3 rounded-xl ${metric.bgColor} border border-white/50`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7D5B47] mb-1 font-['Roboto_Condensed']">
                {metric.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-['Roboto_Condensed']">
                  {metric.description}
                </p>
                <span className="text-xs font-medium text-[#7D5B47] bg-[#7D5B47]/10 px-2 py-1 rounded-full font-['Roboto_Condensed']">
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-['Roboto_Condensed']">
              <Calendar className="h-5 w-5 text-[#7D5B47]" />
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Nuevo usuario registrado", user: "María González", time: "Hace 2 min" },
                { action: "Libreta sanitaria aprobada", user: "Dr. López", time: "Hace 15 min" },
                { action: "Equino transferido", user: "Juan Pérez", time: "Hace 1 hora" },
                { action: "Establecimiento actualizado", user: "Ana Martín", time: "Hace 2 horas" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-['Roboto_Condensed']">{activity.action}</p>
                    <p className="text-xs text-gray-500 font-['Roboto_Condensed']">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-['Roboto_Condensed']">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-['Roboto_Condensed']">
              <FileText className="h-5 w-5 text-[#7D5B47]" />
              <span>Accesos Rápidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Nuevo Usuario", subtitle: "Registrar usuario", color: "bg-gradient-to-br from-[#7D5B47] to-[#9A7B5A]" },
                { title: "Nuevo Equino", subtitle: "Registrar equino", color: "bg-gradient-to-br from-[#9A7B5A] to-[#B89B7A]" },
                { title: "Ver Traslados", subtitle: "Consultar movimientos", color: "bg-gradient-to-br from-[#7D5B47] to-[#8B6B4F]" },
              ].map((shortcut, index) => (
                <div key={index} className={`${shortcut.color} text-white p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md font-['Roboto_Condensed']`}>
                  <h3 className="font-medium text-sm">{shortcut.title}</h3>
                  <p className="text-xs opacity-90">{shortcut.subtitle}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
