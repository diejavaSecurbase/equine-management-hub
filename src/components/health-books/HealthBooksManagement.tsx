
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, FileText, Syringe, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthBookInfo {
  id: number;
  senasaId: string;
  state: string;
  approvedAt: string;
  deleted: boolean;
  updatedAt: string;
  extractionInfoList: BloodExtractionInfo[];
  vaccineApplicationInfoList: VaccineApplicationInfo[];
  equineMinInfo: EquineMinInfo;
  approvalVeterinarian: MinUserInfoDTO;
}

interface BloodExtractionInfo {
  id: number;
  healthBookId: number;
  extractionDate: string;
  veterinarianName: string;
  veterinarianLastName: string;
  veterinarianIdentification: string;
  deleted: boolean;
}

interface VaccineApplicationInfo {
  id: number;
  vaccineCommercialName: string;
  applicationDate: string;
  vaccineDrug: string;
  vaccineGTIN: string;
  vaccineManufacturer: string;
  vaccineCountry: string;
  vaccineLotNumber: string;
  vaccineFabricationDate: string;
  vaccineExpirationDate: string;
  vaccineApplicationNumber: number;
  veterinarianName: string;
  veterinarianLastName: string;
  veterinarianIdentification: string;
  deleted: boolean;
}

interface EquineMinInfo {
  id: number;
  bioId: string;
  isIrisEnrolled: boolean;
  name: string;
  healthBookId: number;
  healthBookIdentification: string;
  healthBookStatus: string;
  chip: string;
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

const HealthBooksManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedHealthBook, setSelectedHealthBook] = useState<HealthBookInfo | null>(null);
  const { toast } = useToast();

  const mockHealthBooks: HealthBookInfo[] = [
    {
      id: 1,
      senasaId: 'HSB001',
      state: 'APPROVED',
      approvedAt: '2024-01-15T10:30:00Z',
      deleted: false,
      updatedAt: '2024-01-15T10:30:00Z',
      extractionInfoList: [
        {
          id: 1,
          healthBookId: 1,
          extractionDate: '2024-01-10T09:00:00Z',
          veterinarianName: 'Dr. Carlos',
          veterinarianLastName: 'López',
          veterinarianIdentification: '20-11111111-1',
          deleted: false
        }
      ],
      vaccineApplicationInfoList: [
        {
          id: 1,
          vaccineCommercialName: 'Equivac EHV',
          applicationDate: '2024-01-12T14:00:00Z',
          vaccineDrug: 'Herpesvirus',
          vaccineGTIN: '1234567890123',
          vaccineManufacturer: 'Zoetis',
          vaccineCountry: 'Argentina',
          vaccineLotNumber: 'LOT123',
          vaccineFabricationDate: '2023-06-01',
          vaccineExpirationDate: '2025-06-01',
          vaccineApplicationNumber: 1,
          veterinarianName: 'Dr. Carlos',
          veterinarianLastName: 'López',
          veterinarianIdentification: '20-11111111-1',
          deleted: false
        }
      ],
      equineMinInfo: {
        id: 1,
        bioId: 'BIO001',
        isIrisEnrolled: true,
        name: 'Thunderbolt',
        healthBookId: 1,
        healthBookIdentification: 'HSB001',
        healthBookStatus: 'APPROVED',
        chip: 'CHIP001',
        deleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      approvalVeterinarian: {
        id: 2,
        name: 'Dr. Carlos',
        lastName: 'López',
        identification: '20-11111111-1',
        email: 'carlos.lopez@email.com',
        profile: 'VETERINARIAN',
        deleted: false
      }
    },
    {
      id: 2,
      senasaId: 'HSB002',
      state: 'PENDING',
      approvedAt: '',
      deleted: false,
      updatedAt: '2024-01-18T15:45:00Z',
      extractionInfoList: [],
      vaccineApplicationInfoList: [],
      equineMinInfo: {
        id: 2,
        bioId: 'BIO002',
        isIrisEnrolled: false,
        name: 'Lightning',
        healthBookId: 2,
        healthBookIdentification: 'HSB002',
        healthBookStatus: 'PENDING',
        chip: 'CHIP002',
        deleted: false,
        createdAt: '2024-01-18T00:00:00Z',
        updatedAt: '2024-01-18T15:45:00Z'
      },
      approvalVeterinarian: {
        id: 0,
        name: '',
        lastName: '',
        identification: '',
        email: '',
        profile: '',
        deleted: false
      }
    }
  ];

  const [healthBooks, setHealthBooks] = useState(mockHealthBooks);

  const filteredHealthBooks = healthBooks.filter(book =>
    book.equineMinInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.senasaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStateBadge = (state: string) => {
    const variants = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[state as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {state === 'APPROVED' ? 'Aprobada' : state === 'PENDING' ? 'Pendiente' : 'Rechazada'}
      </Badge>
    );
  };

  const handleDeleteHealthBook = (healthBookId: number) => {
    setHealthBooks(healthBooks.map(book => 
      book.id === healthBookId ? { ...book, deleted: true } : book
    ));
    toast({
      title: "Libreta eliminada",
      description: "La libreta sanitaria ha sido eliminada correctamente.",
    });
  };

  const handleViewDetail = (healthBook: HealthBookInfo) => {
    setSelectedHealthBook(healthBook);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Libretas Sanitarias</h1>
          <p className="text-gray-600 mt-2">Gestión de libretas sanitarias de equinos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Libreta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nueva Libreta Sanitaria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="senasaId">ID SENASA</Label>
                <Input id="senasaId" placeholder="HSB001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equine">Equino</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Thunderbolt</SelectItem>
                    <SelectItem value="2">Lightning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinario</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Dr. Carlos López</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="gradient-primary text-white">
                  Crear Libreta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Libretas Sanitarias</span>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar libretas..."
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
                <TableHead>ID SENASA</TableHead>
                <TableHead>Equino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Veterinario</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHealthBooks.map((book) => (
                <TableRow key={book.id} className={book.deleted ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{book.senasaId}</span>
                    </div>
                  </TableCell>
                  <TableCell>{book.equineMinInfo.name}</TableCell>
                  <TableCell>{getStateBadge(book.state)}</TableCell>
                  <TableCell>
                    {book.approvalVeterinarian.name ? 
                      `${book.approvalVeterinarian.name} ${book.approvalVeterinarian.lastName}` : 
                      'Sin asignar'
                    }
                  </TableCell>
                  <TableCell>{new Date(book.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetail(book)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteHealthBook(book.id)}
                        disabled={book.deleted}
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

      {/* Dialog de detalle */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalle de Libreta Sanitaria - {selectedHealthBook?.senasaId}</DialogTitle>
          </DialogHeader>
          {selectedHealthBook && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información General</h3>
                  <div className="space-y-2">
                    <p><strong>Equino:</strong> {selectedHealthBook.equineMinInfo.name}</p>
                    <p><strong>Estado:</strong> {getStateBadge(selectedHealthBook.state)}</p>
                    <p><strong>Chip:</strong> {selectedHealthBook.equineMinInfo.chip}</p>
                    {selectedHealthBook.approvedAt && (
                      <p><strong>Aprobada:</strong> {new Date(selectedHealthBook.approvedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Veterinario Responsable</h3>
                  {selectedHealthBook.approvalVeterinarian.name ? (
                    <div className="space-y-2">
                      <p><strong>Nombre:</strong> {selectedHealthBook.approvalVeterinarian.name} {selectedHealthBook.approvalVeterinarian.lastName}</p>
                      <p><strong>Email:</strong> {selectedHealthBook.approvalVeterinarian.email}</p>
                      <p><strong>Identificación:</strong> {selectedHealthBook.approvalVeterinarian.identification}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Sin veterinario asignado</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Droplets className="w-5 h-5 mr-2 text-red-600" />
                  Extracciones de Sangre
                </h3>
                {selectedHealthBook.extractionInfoList.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Veterinario</TableHead>
                        <TableHead>Identificación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedHealthBook.extractionInfoList.map((extraction) => (
                        <TableRow key={extraction.id}>
                          <TableCell>{new Date(extraction.extractionDate).toLocaleDateString()}</TableCell>
                          <TableCell>{extraction.veterinarianName} {extraction.veterinarianLastName}</TableCell>
                          <TableCell>{extraction.veterinarianIdentification}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500">No hay extracciones registradas</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Syringe className="w-5 h-5 mr-2 text-green-600" />
                  Aplicaciones de Vacunas
                </h3>
                {selectedHealthBook.vaccineApplicationInfoList.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vacuna</TableHead>
                        <TableHead>Fecha Aplicación</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Veterinario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedHealthBook.vaccineApplicationInfoList.map((vaccine) => (
                        <TableRow key={vaccine.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{vaccine.vaccineCommercialName}</p>
                              <p className="text-sm text-gray-500">{vaccine.vaccineManufacturer}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(vaccine.applicationDate).toLocaleDateString()}</TableCell>
                          <TableCell>{vaccine.vaccineLotNumber}</TableCell>
                          <TableCell>{vaccine.veterinarianName} {vaccine.veterinarianLastName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500">No hay vacunas registradas</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthBooksManagement;
