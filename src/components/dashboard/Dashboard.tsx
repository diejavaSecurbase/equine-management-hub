
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, FileText, Building, Calendar } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Usuarios",
      value: "2,451",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Usuarios registrados"
    },
    {
      title: "Veterinarios",
      value: "387",
      change: "+5%",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Profesionales activos"
    },
    {
      title: "Equinos",
      value: "8,924",
      change: "+18%",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Equinos registrados"
    },
    {
      title: "Libretas Sanitarias",
      value: "7,238",
      change: "+8%",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Documentos activos"
    },
    {
      title: "Con Biometría",
      value: "4,156",
      change: "+24%",
      icon: User,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Equinos enrolados"
    },
    {
      title: "Establecimientos",
      value: "524",
      change: "+3%",
      icon: Building,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Establecimientos activos"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Vista general del sistema de gestión equina</p>
        </div>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {metric.description}
                </p>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
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
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Accesos Rápidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Nuevo Usuario", subtitle: "Registrar usuario", color: "bg-blue-500" },
                { title: "Nuevo Equino", subtitle: "Registrar equino", color: "bg-green-500" },
                { title: "Nueva Libreta", subtitle: "Crear libreta sanitaria", color: "bg-purple-500" },
                { title: "Ver Traslados", subtitle: "Consultar movimientos", color: "bg-orange-500" },
              ].map((shortcut, index) => (
                <div key={index} className={`${shortcut.color} text-white p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity`}>
                  <h3 className="font-medium text-sm">{shortcut.title}</h3>
                  <p className="text-xs opacity-80">{shortcut.subtitle}</p>
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
