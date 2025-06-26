import React, { useState, useEffect } from 'react';
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
import { healthBookService, HealthBookMinInfo, HealthBookPage } from '@/services/healthBookService';
import { travelService } from '@/services/travelService';
import { userService } from '@/services/userService';

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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedHealthBook, setSelectedHealthBook] = useState<HealthBookMinInfo | null>(null);
  const { toast } = useToast();

  // Paginación
  const [healthBooks, setHealthBooks] = useState<HealthBookMinInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // Detalle real de la libreta sanitaria
  const [detail, setDetail] = useState<HealthBookInfo | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setLoading(true);
    healthBookService.getHealthBooks(currentPage, pageSize)
      .then((page: HealthBookPage) => {
        setHealthBooks(page.content);
        setTotalPages(page.totalPages);
      })
      .catch(() => {
        toast({ title: 'Error', description: 'No se pudieron cargar las libretas sanitarias', variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [currentPage, pageSize]);

  const filteredHealthBooks = healthBooks.filter(book =>
    book.equineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.identification || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.state || '').toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewDetail = async (healthBook: HealthBookMinInfo) => {
    setIsDetailOpen(true);
    setLoadingDetail(true);
    try {
      const data = await healthBookService.getHealthBook(healthBook.id);
      setDetail(data.data);
    } catch {
      toast({ title: 'Error', description: 'No se pudo obtener el detalle', variant: 'destructive' });
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Libretas Sanitarias</h1>
          <p className="text-gray-600 mt-2">Gestión de libretas sanitarias de equinos</p>
        </div>
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
              {filteredHealthBooks.map((book) => {
                let fecha = '-';
                if (book.updatedAt) {
                  const d = new Date(book.updatedAt);
                  fecha = isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
                }
                return (
                  <TableRow key={book.id} className={book.deleted ? 'opacity-50' : ''}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{book.identification}</span>
                      </div>
                    </TableCell>
                    <TableCell>{book.equineName}</TableCell>
                    <TableCell>{getStateBadge(book.state || '')}</TableCell>
                    <TableCell><span>-</span></TableCell>
                    <TableCell>{fecha}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetail(book)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled onClick={() => toast({ title: 'No disponible', description: 'La edición de libretas no está implementada.', variant: 'destructive' })}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast({ title: 'No permitido', description: 'La baja de la libreta sanitaria se realiza eliminando el equino asociado.', variant: 'destructive' })}
                          disabled={book.deleted}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de detalle */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalle de Libreta Sanitaria - {detail?.senasaId || selectedHealthBook?.identification}</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <p className="text-gray-500">Cargando detalle...</p>
          ) : detail ? (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información General</h3>
                  <div className="space-y-2">
                    <p><strong>Equino:</strong> {detail.equineMinInfo?.name}</p>
                    <p><strong>Estado:</strong> {getStateBadge(detail.state || '')}</p>
                    <p><strong>Identificación:</strong> {detail.senasaId}</p>
                    <p><strong>Actualizado:</strong> {detail.updatedAt ? new Date(detail.updatedAt).toLocaleString() : '-'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Veterinario Responsable</h3>
                  {detail.approvalVeterinarian ? (
                    <p>{detail.approvalVeterinarian.name} {detail.approvalVeterinarian.lastName}</p>
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
                {detail.extractionInfoList && detail.extractionInfoList.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Veterinario</TableHead>
                        <TableHead>Identificación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.extractionInfoList.map((extraction) => (
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
                {detail.vaccineApplicationInfoList && detail.vaccineApplicationInfoList.length > 0 ? (
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
                      {detail.vaccineApplicationInfoList.map((vaccine) => (
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
          ) : (
            <p className="text-gray-500">No hay detalle disponible</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthBooksManagement;
