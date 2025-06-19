
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Coat {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const CoatsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoat, setSelectedCoat] = useState<Coat | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Mock data
  const [coats, setCoats] = useState<Coat[]>([
    {
      id: '1',
      name: 'Alazán',
      description: 'Pelaje rojizo con crines y cola del mismo color',
      isActive: true
    },
    {
      id: '2',
      name: 'Zaino',
      description: 'Pelaje castaño oscuro sin pelos de otro color',
      isActive: true
    },
    {
      id: '3',
      name: 'Tordillo',
      description: 'Pelaje blanco con pelos negros mezclados',
      isActive: true
    }
  ]);

  const filteredCoats = coats.filter(coat =>
    coat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newCoat: Coat = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      isActive: true
    };
    
    setCoats([...coats, newCoat]);
    setFormData({ name: '', description: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Pelaje creado",
      description: "El pelaje ha sido creado exitosamente.",
    });
  };

  const handleEdit = () => {
    if (!selectedCoat) return;
    
    setCoats(coats.map(coat => 
      coat.id === selectedCoat.id 
        ? { ...coat, name: formData.name, description: formData.description }
        : coat
    ));
    
    setFormData({ name: '', description: '' });
    setSelectedCoat(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Pelaje actualizado",
      description: "El pelaje ha sido actualizado exitosamente.",
    });
  };

  const handleDelete = (coatId: string) => {
    setCoats(coats.filter(coat => coat.id !== coatId));
    
    toast({
      title: "Pelaje eliminado",
      description: "El pelaje ha sido eliminado exitosamente.",
      variant: "destructive",
    });
  };

  const openEditDialog = (coat: Coat) => {
    setSelectedCoat(coat);
    setFormData({
      name: coat.name,
      description: coat.description
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pelajes</h1>
          <p className="text-gray-600 mt-2">Administra los tipos de pelaje de los equinos</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nuevo Pelaje</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Pelaje</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del pelaje"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del pelaje"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Crear Pelaje
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Pelajes</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar pelajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoats.map((coat) => (
                <TableRow key={coat.id}>
                  <TableCell className="font-medium">{coat.name}</TableCell>
                  <TableCell>{coat.description}</TableCell>
                  <TableCell>
                    <Badge variant={coat.isActive ? "default" : "secondary"}>
                      {coat.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(coat)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el pelaje.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(coat.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pelaje</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del pelaje"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del pelaje"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>
                Actualizar Pelaje
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoatsManagement;
