
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para las configuraciones
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Sistema Equinos',
    siteDescription: 'Back Office para gestión equina',
    adminEmail: 'admin@sistemaequinos.com',
    supportEmail: 'soporte@sistemaequinos.com'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    travelAlerts: true,
    healthBookReminders: true,
    maintenanceAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  });

  const [systemSettings, setSystemSettings] = useState({
    backupFrequency: 'daily',
    logRetention: 30,
    cacheEnabled: true,
    debugMode: false
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado correctamente.",
      });
    }, 1000);
  };

  const handleResetSettings = () => {
    // Reset a valores por defecto
    setGeneralSettings({
      siteName: 'Sistema Equinos',
      siteDescription: 'Back Office para gestión equina',
      adminEmail: 'admin@sistemaequinos.com',
      supportEmail: 'soporte@sistemaequinos.com'
    });
    
    toast({
      title: "Configuración restaurada",
      description: "Se han restaurado los valores por defecto.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-2">Administra las configuraciones generales del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración General */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del Sistema</Label>
              <Input
                id="siteName"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descripción</Label>
              <Input
                id="siteDescription"
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email de Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                value={generalSettings.adminEmail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de Soporte</Label>
              <Input
                id="supportEmail"
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-gray-500">Recibir notificaciones vía email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Traslados</Label>
                <p className="text-sm text-gray-500">Notificar sobre cambios en traslados</p>
              </div>
              <Switch
                checked={notificationSettings.travelAlerts}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, travelAlerts: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios Sanitarios</Label>
                <p className="text-sm text-gray-500">Recordatorios de libretas sanitarias</p>
              </div>
              <Switch
                checked={notificationSettings.healthBookReminders}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, healthBookReminders: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Mantenimiento</Label>
                <p className="text-sm text-gray-500">Notificar sobre mantenimiento del sistema</p>
              </div>
              <Switch
                checked={notificationSettings.maintenanceAlerts}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, maintenanceAlerts: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticación de Dos Factores</Label>
                <p className="text-sm text-gray-500">Activar 2FA para mayor seguridad</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                }
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="480"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                min="30"
                max="365"
                value={securitySettings.passwordExpiry}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Intentos de Login Máximos</Label>
              <Input
                id="loginAttempts"
                type="number"
                min="3"
                max="10"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración del Sistema */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
              <select
                id="backupFrequency"
                value={systemSettings.backupFrequency}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logRetention">Retención de Logs (días)</Label>
              <Input
                id="logRetention"
                type="number"
                min="7"
                max="365"
                value={systemSettings.logRetention}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, logRetention: parseInt(e.target.value) }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cache Habilitado</Label>
                <p className="text-sm text-gray-500">Mejorar rendimiento del sistema</p>
              </div>
              <Switch
                checked={systemSettings.cacheEnabled}
                onCheckedChange={(checked) => 
                  setSystemSettings(prev => ({ ...prev, cacheEnabled: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Debug</Label>
                <p className="text-sm text-gray-500">Activar para desarrollo</p>
              </div>
              <Switch
                checked={systemSettings.debugMode}
                onCheckedChange={(checked) => 
                  setSystemSettings(prev => ({ ...prev, debugMode: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <div className="text-sm text-gray-500">Estado del Servidor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-500">Tiempo de Actividad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1.2GB</div>
              <div className="text-sm text-gray-500">Uso de Memoria</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45MB</div>
              <div className="text-sm text-gray-500">Base de Datos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
