
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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Breed {
  id: string;
  name: string;
  origin: string;
  description: string;
  characteristics: string;
  isActive: boolean;
}

const BreedsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    description: '',
    characteristics: ''
  });

  // Mock data
  const [breeds, setBreeds] = useState<Breed[]>([
    {
      id: '1',
      name: 'Criollo Argentino',
      origin: 'Argentina',
      description: 'Raza equina desarrollada en Argentina, descendiente de los caballos españoles',
      characteristics: 'Resistente, adaptable, buen temperamento',
      isActive: true
    },
    {
      id: '2',
      name: 'Pura Sangre de Carrera',
      origin: 'Inglaterra',
      description: 'Raza especializada en carreras de velocidad',
      characteristics: 'Velocidad, elegancia, temperamento fogoso',
      isActive: true
    },
    {
      id: '3',
      name: 'Árabe',
      origin: 'Península Arábiga',
      description: 'Una de las razas más antiguas y puras del mundo',
      characteristics: 'Resistencia, inteligencia, belleza',
      isActive: true
    }
  ]);

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newBreed: Breed = {
      id: Date.now().toString(),
      name: formData.name,
      origin: formData.origin,
      description: formData.description,
      characteristics: formData.characteristics,
      isActive: true
    };
    
    setBreeds([...breeds, newBreed]);
    setFormData({ name: '', origin: '', description: '', characteristics: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Raza creada",
      description: "La raza ha sido creada exitosamente.",
    });
  };

  const handleEdit = () => {
    if (!selectedBreed) return;
    
    setBreeds(breeds.map(breed => 
      breed.id === selectedBreed.id 
        ? { 
            ...breed, 
            name: formData.name,
            origin: formData.origin,
            description: formData.description,
            characteristics: formData.characteristics
          }
        : breed
    ));
    
    setFormData({ name: '', origin: '', description: '', characteristics: '' });
    setSelectedBreed(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Raza actualizada",
      description: "La raza ha sido actualizada exitosamente.",
    });
  };

  const handleDelete = (breedId: string) => {
    setBreeds(breeds.filter(breed => breed.id !== breedId));
    
    toast({
      title: "Raza eliminada",
      description: "La raza ha sido eliminada exitosamente.",
      variant: "destructive",
    });
  };

  const openEditDialog = (breed: Breed) => {
    setSelectedBreed(breed);
    setFormData({
      name: breed.name,
      origin: breed.origin,
      description: breed.description,
      characteristics: breed.characteristics
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Razas</h1>
          <p className="text-gray-600 mt-2">Administra las razas de equinos</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Raza</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Raza</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nombre de la raza"
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Origen</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="País o región de origen"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción de la raza"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="characteristics">Características</Label>
                <Textarea
                  id="characteristics"
                  value={formData.characteristics}
                  onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                  placeholder="Características principales de la raza"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Crear Raza
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Razas</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar razas..."
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
                <TableHead>Origen</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBreeds.map((breed) => (
                <TableRow key={breed.id}>
                  <TableCell className="font-medium">{breed.name}</TableCell>
                  <TableCell>{breed.origin}</TableCell>
                  <TableCell className="max-w-xs truncate">{breed.description}</TableCell>
                  <TableCell>
                    <Badge variant={breed.isActive ? "default" : "secondary"}>
                      {breed.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(breed)}
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
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la raza.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(breed.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Raza</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre de la raza"
                />
              </div>
              <div>
                <Label htmlFor="edit-origin">Origen</Label>
                <Input
                  id="edit-origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="País o región de origen"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la raza"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-characteristics">Características</Label>
              <Textarea
                id="edit-characteristics"
                value={formData.characteristics}
                onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                placeholder="Características principales de la raza"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>
                Actualizar Raza
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BreedsManagement;
