
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, User } from 'lucide-react';

interface Equine {
  id: number;
  name: string;
  chip: string;
  breedBiotypeName: string;
  sex: string;
  ownerName: string;
  isIrisEnrolled: boolean;
  healthBookStatus: string;
  deleted: boolean;
}

const EquinesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockEquines: Equine[] = [
    {
      id: 1,
      name: 'Thunder',
      chip: 'CHI001234567',
      breedBiotypeName: 'Pura Sangre',
      sex: 'Macho',
      ownerName: 'Juan Pérez',
      isIrisEnrolled: true,
      healthBookStatus: 'APPROVED',
      deleted: false
    },
    {
      id: 2,
      name: 'Star',
      chip: 'CHI007654321',
      breedBiotypeName: 'Criollo',
      sex: 'Hembra',
      ownerName: 'María González',
      isIrisEnrolled: false,
      healthBookStatus: 'PENDING',
      deleted: false
    },
    {
      id: 3,
      name: 'Lightning',
      chip: 'CHI001111111',
      breedBiotypeName: 'Cuarto de Milla',
      sex: 'Macho',
      ownerName: 'Carlos López',
      isIrisEnrolled: true,
      healthBookStatus: 'APPROVED',
      deleted: false
    }
  ];

  const [equines] = useState(mockEquines);

  const filteredEquines = equines.filter(equine =>
    equine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equine.chip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equine.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthBookBadge = (status: string) => {
    const variants = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      APPROVED: 'Aprobada',
      PENDING: 'Pendiente',
      REJECTED: 'Rechazada'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Equinos</h1>
          <p className="text-gray-600 mt-2">Administra la información de equinos registrados</p>
        </div>
        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Equino
        </Button>
      </div>

      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Equinos</span>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar equinos..."
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
                <TableHead>Equino</TableHead>
                <TableHead>Chip</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Biometría</TableHead>
                <TableHead>Libreta Sanitaria</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquines.map((equine) => (
                <TableRow key={equine.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm">🐎</span>
                      </div>
                      <div>
                        <div className="font-medium">{equine.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{equine.chip}</TableCell>
                  <TableCell>{equine.breedBiotypeName}</TableCell>
                  <TableCell>{equine.sex}</TableCell>
                  <TableCell>{equine.ownerName}</TableCell>
                  <TableCell>
                    <Badge variant={equine.isIrisEnrolled ? "default" : "secondary"}>
                      {equine.isIrisEnrolled ? "Enrolado" : "Sin enrolar"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getHealthBookBadge(equine.healthBookStatus)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <User className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
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

export default EquinesManagement;
