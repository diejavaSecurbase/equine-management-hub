import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { UserInfoDTO, UserState } from '@/types/user';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [state, setState] = useState<UserState>({
    users: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    loading: false,
    error: null
  });
  const [editUser, setEditUser] = useState<UserInfoDTO | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserInfoDTO>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadUsers = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await userService.getUsers(state.currentPage, state.pageSize);
      setState(prev => ({
        ...prev,
        users: data.content,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar usuarios'
      }));
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, [state.currentPage, state.pageSize]);

  const handlePageChange = (newPage: number) => {
    setState(prev => ({ ...prev, currentPage: newPage }));
  };

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

  const handleEditUser = (user: UserInfoDTO) => {
    setEditUser(user);
    setEditForm({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (field: keyof UserInfoDTO, value: string | boolean) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      // Check if profile picture was changed
      const hasProfilePictureChange = editForm.profilePicture !== editUser.profilePicture;
      const hasOtherChanges = Object.keys(editForm).some(key => {
        if (key === 'profilePicture') return false;
        return editForm[key as keyof UserInfoDTO] !== editUser[key as keyof UserInfoDTO];
      });

      // If profile picture was changed, use the specific endpoint
      if (hasProfilePictureChange) {
        try {
          await userService.updateProfilePicture(editUser.id, editForm.profilePicture || '');
          toast({ title: 'Foto de perfil actualizada', description: 'La foto se guardó correctamente.' });
        } catch (error: any) {
          console.error('Error updating profile picture:', error);
          toast({ 
            title: 'Error al actualizar foto', 
            description: error.message || 'No se pudo actualizar la foto de perfil', 
            variant: 'destructive' 
          });
          return; // Don't close modal on error
        }
      }

      // If other fields were changed, use the account info endpoint
      if (hasOtherChanges) {
        try {
          // Remove profile picture from the data sent to account info endpoint
          const { profilePicture, ...accountData } = editForm;
          await userService.updateAccountInfo(accountData);
          toast({ title: 'Información de cuenta actualizada', description: 'Los datos se guardaron correctamente.' });
        } catch (error: any) {
          console.error('Error updating account info:', error);
          toast({ 
            title: 'Error al actualizar información', 
            description: error.message || 'No se pudo actualizar la información de cuenta', 
            variant: 'destructive' 
          });
          return; // Don't close modal on error
        }
      }

      // If no changes were detected
      if (!hasProfilePictureChange && !hasOtherChanges) {
        toast({ title: 'Sin cambios', description: 'No se detectaron cambios para guardar.' });
      }
      
      setIsEditDialogOpen(false);
      setEditUser(null);
      await loadUsers();
    } catch (error: any) {
      console.error('Unexpected error in handleSaveEdit:', error);
      toast({ 
        title: 'Error inesperado', 
        description: error.message || 'Ocurrió un error inesperado', 
        variant: 'destructive' 
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (deleteUserId !== null) {
      // Aquí deberías llamar a userService.deleteUser(deleteUserId)
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      });
      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
      await loadUsers();
    }
  };

  const filteredUsers = state.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nueva función para manejar la carga de imagen y convertir a base64
  const handleProfilePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      handleEditFormChange('profilePicture', base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra usuarios del sistema</p>
        </div>
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
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                          {user.profilePicture ? (
                            <img
                              src={`data:image/jpeg;base64,${user.profilePicture}`}
                              alt={`Foto de ${user.name} ${user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name} {user.lastName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.identification}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge variant={user.enrolled ? "default" : "destructive"}>
                        {user.enrolled ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Mostrando {state.users.length} de {state.totalElements} usuarios
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(state.currentPage - 1)}
                disabled={state.currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Página {state.currentPage + 1} de {state.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(state.currentPage + 1)}
                disabled={state.currentPage === state.totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edición de usuario */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4 pt-4">
              {/* Profile picture in its own row */}
              <div className="flex justify-center">
                <div className="space-y-2 text-center">
                  <Label>Foto de perfil</Label>
                  {editForm.profilePicture ? (
                    <img
                      src={`data:image/jpeg;base64,${editForm.profilePicture}`}
                      alt="Foto de perfil"
                      className="mt-2 rounded-full w-20 h-20 object-cover border mx-auto"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg"
                      alt="Avatar genérico"
                      className="mt-2 rounded-full w-20 h-20 object-cover border mx-auto"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleProfilePictureUpload}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={editForm.name || ''} onChange={e => handleEditFormChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" value={editForm.lastName || ''} onChange={e => handleEditFormChange('lastName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={editForm.email || ''} onChange={e => handleEditFormChange('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identificationType">Tipo de Identificación</Label>
                  <Input id="identificationType" value={editForm.identificationType || ''} onChange={e => handleEditFormChange('identificationType', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identification">Identificación</Label>
                  <Input id="identification" value={editForm.identification || ''} onChange={e => handleEditFormChange('identification', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Fecha de Nacimiento</Label>
                  <Input id="birthday" type="date" value={editForm.birthday || ''} onChange={e => handleEditFormChange('birthday', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Teléfono</Label>
                  <Input id="phoneNumber" value={editForm.phoneNumber || ''} onChange={e => handleEditFormChange('phoneNumber', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" value={editForm.country || ''} onChange={e => handleEditFormChange('country', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Input id="province" value={editForm.province || ''} onChange={e => handleEditFormChange('province', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={editForm.city || ''} onChange={e => handleEditFormChange('city', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={editForm.address || ''} onChange={e => handleEditFormChange('address', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senasaId">ID SENASA</Label>
                  <Input id="senasaId" value={editForm.senasaId || ''} onChange={e => handleEditFormChange('senasaId', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="veterinarianCollegeId">Matrícula Veterinario</Label>
                  <Input id="veterinarianCollegeId" value={editForm.veterinarianCollegeId || ''} onChange={e => handleEditFormChange('veterinarianCollegeId', e.target.value)} />
                </div>
                <div className="space-y-2 flex items-center space-x-2">
                  <Label htmlFor="acceptNotifications">Acepta Notificaciones</Label>
                  <input
                    id="acceptNotifications"
                    type="checkbox"
                    checked={Boolean(editForm.acceptNotifications)}
                    onChange={e => handleEditFormChange('acceptNotifications', e.target.checked as boolean)}
                    className="w-4 h-4"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={editLoading}>
                  Cancelar
                </Button>
                <Button className="gradient-primary text-white" onClick={handleSaveEdit} disabled={editLoading}>
                  {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este usuario?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
