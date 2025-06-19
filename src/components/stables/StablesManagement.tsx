
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Plus, Edit, Trash2, Building, ChevronDown, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StableInfoDTO {
  id: number;
  name: string;
  alias: string;
  phoneNumber: string;
  identificationType: string;
  identification: string;
  renspa: string;
  type: 'SPORT' | 'REPRODUCTIVE';
  country: string;
  province: string;
  city: string;
  address: string;
  owner: MinUserInfoDTO;
  deleted: boolean;
  equines?: EquineMinInfo[];
  administrators?: MinUserInfoDTO[];
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
  healthBookStatus: string;
}

const StablesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [selectedStable, setSelectedStable] = useState<StableInfoDTO | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const mockStables: StableInfoDTO[] = [
    {
      id: 1,
      name: 'Haras San Jorge',
      alias: 'HSJ',
      phoneNumber: '+54 11 1234-5678',
      identificationType: 'CUIT',
      identification: '20-12345678-9',
      renspa: 'RENSPA001',
      type: 'SPORT',
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'San Isidro',
      address: 'Av. Libertador 1234',
      owner: {
        id: 1,
        name: 'Juan',
        lastName: 'Pérez',
        identification: '20-12345678-9',
        email: 'juan.perez@email.com',
        profile: 'ADMINISTRATOR',
        deleted: false
      },
      deleted: false,
      equines: [
        { id: 1, name: 'Thunderbolt', chip: 'CHIP001', healthBookStatus: 'APPROVED' },
        { id: 2, name: 'Lightning', chip: 'CHIP002', healthBookStatus: 'PENDING' }
      ],
      administrators: [
        {
          id: 1,
          name: 'Juan',
          lastName: 'Pérez',
          identification: '20-12345678-9',
          email: 'juan.perez@email.com',
          profile: 'ADMINISTRATOR',
          deleted: false
        }
      ]
    },
    {
      id: 2,
      name: 'Establecimiento El Ombú',
      alias: 'EO',
      phoneNumber: '+54 11 9876-5432',
      identificationType: 'CUIT',
      identification: '27-87654321-2',
      renspa: 'RENSPA002',
      type: 'REPRODUCTIVE',
      country: 'Argentina',
      province: 'Córdoba',
      city: 'Villa Carlos Paz',
      address: 'Ruta 38 Km 15',
      owner: {
        id: 3,
        name: 'María',
        lastName: 'González',
        identification: '27-87654321-2',
        email: 'maria.gonzalez@email.com',
        profile: 'ADMINISTRATOR',
        deleted: false
      },
      deleted: false,
      equines: [],
      administrators: [
        {
          id: 3,
          name: 'María',
          lastName: 'González',
          identification: '27-87654321-2',
          email: 'maria.gonzalez@email.com',
          profile: 'ADMINISTRATOR',
          deleted: false
        }
      ]
    }
  ];

  const [stables, setStables] = useState(mockStables);

  const availableManagers = [
    { id: 4, name: 'Carlos', lastName: 'López', email: 'carlos.lopez@email.com' },
    { id: 5, name: 'Ana', lastName: 'Martínez', email: 'ana.martinez@email.com' }
  ];

  const filteredStables = stables.filter(stable =>
    stable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stable.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stable.renspa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const variants = {
      SPORT: 'bg-blue-100 text-blue-800',
      REPRODUCTIVE: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      SPORT: 'Deportivo',
      REPRODUCTIVE: 'Reproductivo'
    };
    
    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const getHealthBookBadge = (status: string) => {
    const variants = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status === 'APPROVED' ? 'Aprobada' : status === 'PENDING' ? 'Pendiente' : 'Rechazada'}
      </Badge>
    );
  };

  const handleDeleteStable = (stableId: number) => {
    setStables(stables.map(stable => 
      stable.id === stableId ? { ...stable, deleted: true } : stable
    ));
    toast({
      title: "Establecimiento eliminado",
      description: "El establecimiento ha sido eliminado correctamente.",
    });
  };

  const toggleRowExpansion = (stableId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(stableId)) {
      newExpanded.delete(stableId);
    } else {
      newExpanded.add(stableId);
    }
    setExpandedRows(newExpanded);
  };

  const handleAssignManager = (stable: StableInfoDTO) => {
    setSelectedStable(stable);
    setIsManagerDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Establecimientos</h1>
          <p className="text-gray-600 mt-2">Administra establecimientos equinos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Establecimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Establecimiento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Haras San Jorge" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alias">Alias</Label>
                  <Input id="alias" placeholder="HSJ" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identification">Identificación</Label>
                  <Input id="identification" placeholder="20-12345678-9" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renspa">RENSPA</Label>
                  <Input id="renspa" placeholder="RENSPA001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPORT">Deportivo</SelectItem>
                      <SelectItem value="REPRODUCTIVE">Reproductivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+54 11 1234-5678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Av. Libertador 1234" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" placeholder="Argentina" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Input id="province" placeholder="Buenos Aires" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" placeholder="San Isidro" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Propietario</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Juan Pérez</SelectItem>
                    <SelectItem value="3">María González</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="gradient-primary text-white">
                  Crear Establecimiento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Establecimientos</span>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar establecimientos..."
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
                <TableHead>Establecimiento</TableHead>
                <TableHead>RENSPA</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStables.map((stable) => (
                <React.Fragment key={stable.id}>
                  <TableRow className={stable.deleted ? 'opacity-50' : ''}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{stable.name}</div>
                          <div className="text-sm text-gray-500">{stable.alias}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stable.renspa}</TableCell>
                    <TableCell>{getTypeBadge(stable.type)}</TableCell>
                    <TableCell>{stable.owner.name} {stable.owner.lastName}</TableCell>
                    <TableCell>{stable.city}, {stable.province}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleRowExpansion(stable.id)}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            expandedRows.has(stable.id) ? 'rotate-180' : ''
                          }`} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAssignManager(stable)}
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteStable(stable.id)}
                          disabled={stable.deleted}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(stable.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-gray-50 p-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Equinos Asociados ({stable.equines?.length || 0})
                              </h4>
                              {stable.equines && stable.equines.length > 0 ? (
                                <div className="space-y-2">
                                  {stable.equines.map((equine) => (
                                    <div key={equine.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div>
                                        <span className="font-medium">{equine.name}</span>
                                        <span className="text-sm text-gray-500 ml-2">({equine.chip})</span>
                                      </div>
                                      {getHealthBookBadge(equine.healthBookStatus)}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500">No hay equinos asociados</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Administradores ({stable.administrators?.length || 0})
                              </h4>
                              {stable.administrators && stable.administrators.length > 0 ? (
                                <div className="space-y-2">
                                  {stable.administrators.map((admin) => (
                                    <div key={admin.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div>
                                        <span className="font-medium">{admin.name} {admin.lastName}</span>
                                        <div className="text-sm text-gray-500">{admin.email}</div>
                                      </div>
                                      <Badge variant="outline">{admin.profile}</Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500">No hay administradores asignados</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para asignar gestor */}
      <Dialog open={isManagerDialogOpen} onOpenChange={setIsManagerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar Gestor - {selectedStable?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manager">Seleccionar Gestor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar gestor" />
                </SelectTrigger>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.name} {manager.lastName} - {manager.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsManagerDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="gradient-primary text-white">
                Asignar Gestor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StablesManagement;
