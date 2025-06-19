
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Calendar, Truck, User } from 'lucide-react';

interface TravelInfo {
  id: number;
  reference: string;
  origin: LocationInfo;
  destination: LocationInfo;
  travelStatus: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';
  startAt: string;
  endsAt: string;
  creator: MinUserInfoDTO;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  equines?: EquineMinInfo[];
  motivo?: string;
}

interface LocationInfo {
  id: number;
  alias: string;
  country: string;
  province: string;
  city: string;
  address: string;
  stableName: string;
  stableRenspa: string;
  eventName: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MinUserInfoDTO {
  id: number;
  name: string;
  lastName: string;
  identification: string;
  email: string;
  profile: string;
  deleted: boolean;
}

interface EquineMinInfo {
  id: number;
  name: string;
  chip: string;
}

const TravelsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEquine, setFilterEquine] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const mockTravels: TravelInfo[] = [
    {
      id: 1,
      reference: 'TRV001',
      origin: {
        id: 1,
        alias: 'Haras San Jorge',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'San Isidro',
        address: 'Av. Libertador 1234',
        stableName: 'Haras San Jorge',
        stableRenspa: 'RENSPA001',
        eventName: '',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      destination: {
        id: 2,
        alias: 'Club Hípico',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'Palermo',
        address: 'Av. del Libertador 4101',
        stableName: 'Club Hípico Argentino',
        stableRenspa: 'RENSPA003',
        eventName: 'Concurso de Salto',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      travelStatus: 'DONE',
      startAt: '2024-01-15T08:00:00Z',
      endsAt: '2024-01-17T18:00:00Z',
      creator: {
        id: 1,
        name: 'Juan',
        lastName: 'Pérez',
        identification: '20-12345678-9',
        email: 'juan.perez@email.com',
        profile: 'ADMINISTRATOR',
        deleted: false
      },
      deleted: false,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-17T18:30:00Z',
      equines: [
        { id: 1, name: 'Thunderbolt', chip: 'CHIP001' }
      ],
      motivo: 'Participación en concurso de salto'
    },
    {
      id: 2,
      reference: 'TRV002',
      origin: {
        id: 2,
        alias: 'El Ombú',
        country: 'Argentina',
        province: 'Córdoba',
        city: 'Villa Carlos Paz',
        address: 'Ruta 38 Km 15',
        stableName: 'Establecimiento El Ombú',
        stableRenspa: 'RENSPA002',
        eventName: '',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      destination: {
        id: 3,
        alias: 'Veterinaria Central',
        country: 'Argentina',
        province: 'Córdoba',
        city: 'Córdoba Capital',
        address: 'Av. Colón 1500',
        stableName: '',
        stableRenspa: '',
        eventName: 'Consulta veterinaria',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      travelStatus: 'CONFIRMED',
      startAt: '2024-01-25T09:00:00Z',
      endsAt: '2024-01-25T15:00:00Z',
      creator: {
        id: 3,
        name: 'María',
        lastName: 'González',
        identification: '27-87654321-2',
        email: 'maria.gonzalez@email.com',
        profile: 'ADMINISTRATOR',
        deleted: false
      },
      deleted: false,
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-01-20T14:00:00Z',
      equines: [
        { id: 2, name: 'Lightning', chip: 'CHIP002' }
      ],
      motivo: 'Consulta veterinaria de rutina'
    },
    {
      id: 3,
      reference: 'TRV003',
      origin: {
        id: 1,
        alias: 'Haras San Jorge',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'San Isidro',
        address: 'Av. Libertador 1234',
        stableName: 'Haras San Jorge',
        stableRenspa: 'RENSPA001',
        eventName: '',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      destination: {
        id: 4,
        alias: 'Haras La Pampa',
        country: 'Argentina',
        province: 'La Pampa',
        city: 'General Pico',
        address: 'Ruta 5 Km 320',
        stableName: 'Haras La Pampa',
        stableRenspa: 'RENSPA004',
        eventName: '',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      travelStatus: 'PENDING',
      startAt: '2024-02-01T10:00:00Z',
      endsAt: '2024-02-03T16:00:00Z',
      creator: {
        id: 1,
        name: 'Juan',
        lastName: 'Pérez',
        identification: '20-12345678-9',
        email: 'juan.perez@email.com',
        profile: 'ADMINISTRATOR',
        deleted: false
      },
      deleted: false,
      createdAt: '2024-01-22T11:00:00Z',
      updatedAt: '2024-01-22T11:00:00Z',
      equines: [
        { id: 1, name: 'Thunderbolt', chip: 'CHIP001' }
      ],
      motivo: 'Traslado para reproducción'
    }
  ];

  const [travels] = useState(mockTravels);

  const availableEquines = [
    { id: 1, name: 'Thunderbolt' },
    { id: 2, name: 'Lightning' }
  ];

  const filteredTravels = travels.filter(travel => {
    const matchesSearch = travel.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         travel.origin.stableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         travel.destination.stableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (travel.motivo && travel.motivo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEquine = !filterEquine || travel.equines?.some(equine => 
      equine.id.toString() === filterEquine
    );
    
    const matchesStatus = !filterStatus || travel.travelStatus === filterStatus;
    
    const matchesDateFrom = !filterDateFrom || new Date(travel.startAt) >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || new Date(travel.startAt) <= new Date(filterDateTo);
    
    return matchesSearch && matchesEquine && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-orange-100 text-orange-800',
      DONE: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      IN_PROGRESS: 'En Progreso',
      DONE: 'Completado',
      CANCELED: 'Cancelado'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterEquine('');
    setFilterStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consulta de Traslados</h1>
          <p className="text-gray-600 mt-2">Consulta y seguimiento de traslados de equinos</p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Búsqueda General</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Referencia, establecimiento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equine">Equino</Label>
              <Select value={filterEquine} onValueChange={setFilterEquine}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los equinos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los equinos</SelectItem>
                  {availableEquines.map((equine) => (
                    <SelectItem key={equine.id} value={equine.id.toString()}>
                      {equine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                  <SelectItem value="DONE">Completado</SelectItem>
                  <SelectItem value="CANCELED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resultados de Traslados ({filteredTravels.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referencia</TableHead>
                <TableHead>Equinos</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Creador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTravels.map((travel) => (
                <TableRow key={travel.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{travel.reference}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {travel.equines?.map((equine) => (
                        <div key={equine.id} className="flex items-center space-x-2">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className="text-sm">{equine.name}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">{travel.origin.stableName || travel.origin.alias}</div>
                        <div className="text-sm text-gray-500">
                          {travel.origin.city}, {travel.origin.province}
                        </div>
                        {travel.origin.stableRenspa && (
                          <div className="text-xs text-gray-400">{travel.origin.stableRenspa}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium">{travel.destination.stableName || travel.destination.alias}</div>
                        <div className="text-sm text-gray-500">
                          {travel.destination.city}, {travel.destination.province}
                        </div>
                        {travel.destination.stableRenspa && (
                          <div className="text-xs text-gray-400">{travel.destination.stableRenspa}</div>
                        )}
                        {travel.destination.eventName && (
                          <div className="text-xs text-blue-600">{travel.destination.eventName}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm">
                          <strong>Inicio:</strong> {new Date(travel.startAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm">
                          <strong>Fin:</strong> {new Date(travel.endsAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(travel.travelStatus)}</TableCell>
                  <TableCell>
                    <div className="max-w-40">
                      <p className="text-sm text-gray-700 truncate" title={travel.motivo}>
                        {travel.motivo || 'Sin especificar'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">
                        {travel.creator.name} {travel.creator.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{travel.creator.profile}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTravels.length === 0 && (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron traslados con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelsManagement;
