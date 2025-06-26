import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Calendar, Truck, User } from 'lucide-react';
import { travelService, TravelInfo, AddTravelDTO, EditTravelDTO } from '@/services/travelService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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
  const [travels, setTravels] = useState<TravelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const { toast } = useToast();

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEquine, setFilterEquine] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // ABM
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState<TravelInfo | null>(null);
  const [formData, setFormData] = useState<AddTravelDTO | EditTravelDTO>({
    reference: '',
    origin: { alias: '', country: '', province: '', city: '', address: '' },
    destination: { alias: '', country: '', province: '', city: '', address: '' },
    startAt: '',
    endsAt: '',
    creatorId: 0,
    equineIds: [],
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddTravelDTO>({
    reference: '',
    origin: { country: '', province: '', city: '', address: '', alias: '' },
    destination: { country: '', province: '', city: '', address: '', alias: '' },
    startAt: '',
    endsAt: '',
    creatorId: 1, // TODO: reemplazar por el usuario logueado
    equineIds: [],
  });
  const [addLoading, setAddLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [equines, setEquines] = useState<any[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [selectedEquines, setSelectedEquines] = useState<string[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [equinesLoading, setEquinesLoading] = useState(false);

  useEffect(() => {
    loadTravels();
  }, [currentPage, pageSize]);

  useEffect(() => {
    // Cargar propietarios al abrir el modal de alta
    if (isAddDialogOpen) {
      setOwnersLoading(true);
      travelService.getOwners().then(data => {
        setOwners(data);
        setOwnersLoading(false);
      });
      setSelectedOwner('');
      setEquines([]);
      setSelectedEquines([]);
    }
  }, [isAddDialogOpen]);

  useEffect(() => {
    // Cargar equinos al seleccionar propietario
    if (selectedOwner) {
      setEquinesLoading(true);
      travelService.getEquinesByOwner(Number(selectedOwner)).then(data => {
        setEquines(data);
        setEquinesLoading(false);
      });
      setSelectedEquines([]);
    } else {
      setEquines([]);
      setSelectedEquines([]);
    }
  }, [selectedOwner]);

  const loadTravels = async () => {
    try {
      setLoading(true);
      const response = await travelService.getTravels(currentPage, pageSize, {}); // Puedes agregar filtros aquí
      setTravels(response.content);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar los traslados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Métodos ABM (alta, edición, eliminación)
  const handleCreateTravel = async () => {
    try {
      setLoading(true);
      await travelService.addTravel(formData as AddTravelDTO);
      setIsDialogOpen(false);
      loadTravels();
      toast({ title: 'Traslado creado', description: 'El traslado fue creado correctamente.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Error al crear el traslado', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTravel = async () => {
    if (!selectedTravel) return;
    try {
      setLoading(true);
      await travelService.editTravel(selectedTravel.id, formData as EditTravelDTO);
      setIsDialogOpen(false);
      loadTravels();
      toast({ title: 'Traslado actualizado', description: 'El traslado fue actualizado correctamente.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Error al actualizar el traslado', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTravel = async (id: number) => {
    try {
      setLoading(true);
      await travelService.deleteTravel(id);
      loadTravels();
      toast({ title: 'Traslado eliminado', description: 'El traslado fue eliminado correctamente.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Error al eliminar el traslado', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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

  // Handler temporal para alta de traslado
  const handleAddTravel = async () => {
    if (!selectedOwner) {
      toast({ title: 'Error', description: 'Debes seleccionar un propietario.', variant: 'destructive' });
      return;
    }
    if (!selectedEquines.length) {
      toast({ title: 'Error', description: 'Debes seleccionar al menos un equino.', variant: 'destructive' });
      return;
    }
    setAddLoading(true);
    try {
      await travelService.addTravel({
        ...addForm,
        creatorId: Number(selectedOwner),
        equineIds: selectedEquines.map(Number),
      });
      setIsAddDialogOpen(false);
      setAddForm({
        reference: '',
        origin: { country: '', province: '', city: '', address: '', alias: '' },
        destination: { country: '', province: '', city: '', address: '', alias: '' },
        startAt: '',
        endsAt: '',
        creatorId: 1,
        equineIds: [],
      });
      setSelectedOwner('');
      setSelectedEquines([]);
      toast({ title: 'Traslado creado', description: 'El traslado fue creado correctamente.' });
      loadTravels();
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo crear el traslado.' });
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consulta de Traslados</h1>
          <p className="text-gray-600 mt-2">Consulta y seguimiento de traslados de equinos</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
          Nuevo traslado
        </Button>
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
                  <SelectItem value="all">Todos los equinos</SelectItem>
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
                  <SelectItem value="all">Todos los estados</SelectItem>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg w-full p-0 sm:p-6">
          <DialogTitle className="px-6 pt-6">Nuevo traslado</DialogTitle>
          <div
            className="px-6 pb-6"
            style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <Input placeholder="Referencia" value={addForm.reference} onChange={e => setAddForm(f => ({ ...f, reference: e.target.value }))} />
            {/* Selector de propietario */}
            <Label>Propietario</Label>
            <Select value={selectedOwner} onValueChange={setSelectedOwner} disabled={ownersLoading}>
              <SelectTrigger>
                <SelectValue placeholder={ownersLoading ? 'Cargando...' : 'Selecciona un propietario'} />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id.toString()}>
                    {owner.name} {owner.lastName} ({owner.identification})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Selector múltiple de equinos */}
            <Label>Equinos</Label>
            <select
              multiple
              value={selectedEquines}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setSelectedEquines(options);
              }}
              disabled={!selectedOwner || equinesLoading}
              style={{ minHeight: 80, border: '1px solid #ccc', borderRadius: 4, padding: 4 }}
            >
              {equines.map((equine: any) => (
                <option key={equine.id} value={equine.id.toString()}>
                  {equine.name} ({equine.chip})
                </option>
              ))}
            </select>
            {/* Resto de campos */}
            <div style={{ fontWeight: 600 }}>Origen</div>
            <Input placeholder="País" value={addForm.origin.country} onChange={e => setAddForm(f => ({ ...f, origin: { ...f.origin, country: e.target.value } }))} />
            <Input placeholder="Provincia" value={addForm.origin.province} onChange={e => setAddForm(f => ({ ...f, origin: { ...f.origin, province: e.target.value } }))} />
            <Input placeholder="Ciudad" value={addForm.origin.city} onChange={e => setAddForm(f => ({ ...f, origin: { ...f.origin, city: e.target.value } }))} />
            <Textarea placeholder="Dirección" value={addForm.origin.address} onChange={e => setAddForm(f => ({ ...f, origin: { ...f.origin, address: e.target.value } }))} />
            <div style={{ fontWeight: 600 }}>Destino</div>
            <Input placeholder="País" value={addForm.destination.country} onChange={e => setAddForm(f => ({ ...f, destination: { ...f.destination, country: e.target.value } }))} />
            <Input placeholder="Provincia" value={addForm.destination.province} onChange={e => setAddForm(f => ({ ...f, destination: { ...f.destination, province: e.target.value } }))} />
            <Input placeholder="Ciudad" value={addForm.destination.city} onChange={e => setAddForm(f => ({ ...f, destination: { ...f.destination, city: e.target.value } }))} />
            <Textarea placeholder="Dirección" value={addForm.destination.address} onChange={e => setAddForm(f => ({ ...f, destination: { ...f.destination, address: e.target.value } }))} />
            <label style={{ fontWeight: 600 }}>Fecha y hora de inicio</label>
            <Input type="datetime-local" value={addForm.startAt} onChange={e => setAddForm(f => ({ ...f, startAt: e.target.value }))} />
            <label style={{ fontWeight: 600 }}>Fecha y hora de fin (opcional)</label>
            <Input type="datetime-local" value={addForm.endsAt} onChange={e => setAddForm(f => ({ ...f, endsAt: e.target.value }))} />
          </div>
          <div className="px-6 pb-6 flex gap-2 justify-end">
            <Button onClick={handleAddTravel} variant="default" disabled={addLoading}>Guardar</Button>
            <Button onClick={() => setIsAddDialogOpen(false)} variant="secondary" disabled={addLoading}>Cancelar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelsManagement;
