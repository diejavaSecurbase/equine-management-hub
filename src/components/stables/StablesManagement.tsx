import React, { useState, useEffect } from 'react';
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
import { stableService, StableInfoDTO, AddStableDTO, EditStableDTO, StableTypeDTO, MinUserInfoDTO } from '@/services/stableService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

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
  const [stables, setStables] = useState<StableInfoDTO[]>([]);
  const [stableTypes, setStableTypes] = useState<StableTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState<AddStableDTO>({
    name: '',
    alias: '',
    phoneNumber: '',
    identificationType: 'CUIT',
    identification: '',
    renspa: '',
    typeId: 0,
    country: '',
    province: '',
    city: '',
    address: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadStables();
    loadStableTypes();
  }, [currentPage]);

  const loadStables = async () => {
    try {
      setLoading(true);
      const response = await stableService.getStables(currentPage, pageSize, 'id');
      setStables(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar los establecimientos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStableTypes = async () => {
    try {
      const types = await stableService.getStableTypes();
      setStableTypes(types);
    } catch (error) {
      console.error('Error loading stable types:', error);
    }
  };

  const handleCreateStable = async () => {
    try {
      await stableService.createStable(formData);
      toast({
        title: "Éxito",
        description: "Establecimiento creado correctamente",
      });
      setIsDialogOpen(false);
      resetForm();
      loadStables();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el establecimiento",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStable = async () => {
    if (!selectedStable) return;
    
    try {
      await stableService.updateStable(selectedStable.id, formData);
      toast({
        title: "Éxito",
        description: "Establecimiento actualizado correctamente",
      });
      setIsDialogOpen(false);
      resetForm();
      loadStables();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el establecimiento",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStable = async (stableId: number) => {
    try {
      await stableService.deleteStable(stableId);
      toast({
        title: "Éxito",
        description: "Establecimiento eliminado correctamente",
      });
      loadStables();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el establecimiento",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (stable: StableInfoDTO) => {
    setSelectedStable(stable);
    setIsEditMode(true);
    setFormData({
      name: stable.name,
      alias: stable.alias,
      phoneNumber: stable.phoneNumber,
      identificationType: stable.identificationType,
      identification: stable.identification,
      renspa: stable.renspa,
      typeId: stable.type?.id,
      country: stable.country,
      province: stable.province,
      city: stable.city,
      address: stable.address,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      alias: '',
      phoneNumber: '',
      identificationType: 'CUIT',
      identification: '',
      renspa: '',
      typeId: 0,
      country: '',
      province: '',
      city: '',
      address: '',
    });
    setSelectedStable(null);
    setIsEditMode(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredStables = stables.filter(stable =>
    stable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stable.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stable.renspa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: any) => {
    if (!type) return null;
    
    const variants = {
      SPORT: 'bg-blue-100 text-blue-800',
      REPRODUCTIVE: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      SPORT: 'Deportivo',
      REPRODUCTIVE: 'Reproductivo'
    };
    
    return (
      <Badge className={variants[type.name as keyof typeof variants]}>
        {labels[type.name as keyof typeof labels]}
      </Badge>
    );
  };

  const toggleRowExpansion = (stableId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(stableId)) {
      newExpandedRows.delete(stableId);
    } else {
      newExpandedRows.add(stableId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Gestión de Establecimientos
            </div>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Establecimiento
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, alias o RENSPA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando establecimientos...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Alias</TableHead>
                    <TableHead>RENSPA</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStables.map((stable) => (
                    <React.Fragment key={stable.id}>
                      <TableRow>
                        <TableCell className="font-medium">{stable.name}</TableCell>
                        <TableCell>{stable.alias}</TableCell>
                        <TableCell>{stable.renspa}</TableCell>
                        <TableCell>{getTypeBadge(stable.type)}</TableCell>
                        <TableCell>
                          {stable.city}, {stable.province}
                        </TableCell>
                        <TableCell>
                          {stable.owner ? `${stable.owner.name} ${stable.owner.lastName}` : 'Sin owner'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRowExpansion(stable.id)}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${
                                expandedRows.has(stable.id) ? 'rotate-180' : ''
                              }`} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(stable)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará el establecimiento "{stable.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteStable(stable.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(stable.id) && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Información de Contacto</h4>
                                  <p><strong>Teléfono:</strong> {stable.phoneNumber || 'No especificado'}</p>
                                  <p><strong>Identificación:</strong> {stable.identification || 'No especificado'}</p>
                                  <p><strong>Dirección:</strong> {stable.address}, {stable.city}, {stable.province}, {stable.country}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Detalles</h4>
                                  <p><strong>Owner:</strong> {stable.owner ? `${stable.owner.name} ${stable.owner.lastName}` : 'Sin owner'}</p>
                                  <p><strong>Email Owner:</strong> {stable.owner?.email || 'No especificado'}</p>
                                  <p><strong>Estado:</strong> {stable.deleted ? 'Eliminado' : 'Activo'}</p>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Página {currentPage + 1} de {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del establecimiento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alias">Alias</Label>
              <Input
                id="alias"
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                placeholder="Alias del establecimiento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renspa">RENSPA</Label>
              <Input
                id="renspa"
                value={formData.renspa}
                onChange={(e) => setFormData({ ...formData, renspa: e.target.value })}
                placeholder="RENSPA001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeId">Tipo</Label>
              <Select
                value={formData.typeId?.toString()}
                onValueChange={(value) => setFormData({ ...formData, typeId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {stableTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identification">Identificación</Label>
              <Input
                id="identification"
                value={formData.identification}
                onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
                placeholder="20-12345678-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Argentina"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder="Buenos Aires"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="San Isidro"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Av. Libertador 1234"
                rows={3}
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={isEditMode ? handleUpdateStable : handleCreateStable}>
              {isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StablesManagement;
