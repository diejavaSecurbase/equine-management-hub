import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoEquusID from '../../../public/logo/logo-equusid.svg';
import LogoTexto from '../../../public/logo/logo-texto.svg';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7D5B47]/5 to-[#9A7B5A]/10 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 flex justify-center">
              <img src={LogoEquusID} alt="Logo EquusID" className="w-16 h-16" />
            </div>
            <div className="mx-auto mb-4 flex justify-center">
              <img src={LogoTexto} alt="Logo texto EquusID" className="h-10" />
            </div>
            <CardDescription className="text-gray-600 mt-2 font-['Roboto_Condensed']">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-['Roboto_Condensed']">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 border-gray-200 focus:border-[#7D5B47] focus:ring-[#7D5B47] font-['Roboto_Condensed']"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 font-['Roboto_Condensed']">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 px-4 border-gray-200 focus:border-[#7D5B47] focus:ring-[#7D5B47] font-['Roboto_Condensed']"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#7D5B47] to-[#9A7B5A] hover:from-[#6A4D3D] hover:to-[#8B6B4F] transition-all duration-200 text-white font-medium font-['Roboto_Condensed'] shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
