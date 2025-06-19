
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  identification: string;
  profile: 'ADMINISTRATOR' | 'VETERINARIAN' | 'VERIFIER';
  enrolled: boolean;
  deleted: boolean;
}

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      identification: '20-12345678-9',
      profile: 'ADMINISTRATOR',
      enrolled: true,
      deleted: false
    },
    {
      id: 2,
      name: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      identification: '27-87654321-2',
      profile: 'VETERINARIAN',
      enrolled: false,
      deleted: false
    },
    {
      id: 3,
      name: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@email.com',
      identification: '20-11111111-1',
      profile: 'VERIFIER',
      enrolled: true,
      deleted: false
    }
  ];

  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProfileBadge = (profile: string) => {
    const variants = {
      ADMINISTRATOR: 'bg-blue-100 text-blue-800',
      VETERINARIAN: 'bg-green-100 text-green-800',
      VERIFIER: 'bg-orange-100 text-orange-800'
    };
    const labels = {
      ADMINISTRATOR: 'Administrador',
      VETERINARIAN: 'Veterinario',
      VERIFIER: 'Verificador'
    };
    
    return (
      <Badge className={variants[profile as keyof typeof variants]}>
        {labels[profile as keyof typeof labels]}
      </Badge>
    );
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, deleted: true } : user
    ));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra usuarios del sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Apellido" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identification">Identificación</Label>
                <Input id="identification" placeholder="20-12345678-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile">Perfil</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMINISTRATOR">Administrador</SelectItem>
                    <SelectItem value="VETERINARIAN">Veterinario</SelectItem>
                    <SelectItem value="VERIFIER">Verificador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="gradient-primary text-white">
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Usuarios</span>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Biometría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.deleted ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name} {user.lastName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.identification}</TableCell>
                  <TableCell>{getProfileBadge(user.profile)}</TableCell>
                  <TableCell>
                    <Badge variant={user.enrolled ? "default" : "secondary"}>
                      {user.enrolled ? "Enrolado" : "Sin enrolar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.deleted ? "destructive" : "default"}>
                      {user.deleted ? "Eliminado" : "Activo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.deleted}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
