'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { contentAPI, Content } from '@/lib/content-api';
import { Edit, Trash2, ExternalLink, Search, Plus, Filter } from 'lucide-react';

interface ContentListProps {
  onEdit?: (content: Content) => void;
  onCreate?: () => void;
  isAdmin?: boolean;
}

export function ContentList({ onEdit, onCreate, isAdmin = false }: ContentListProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'video'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const loadContents = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      const response = await contentAPI.getAll(params);
      setContents(response.data.contents);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error loading contents:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los contenidos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [currentPage, search, typeFilter]);

  const handleDelete = async (id: number) => {
    try {
      setDeleting(id);
      await contentAPI.delete(id);
      toast({
        title: 'Éxito',
        description: 'Contenido eliminado correctamente',
      });
      await loadContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el contenido',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value as 'all' | 'pdf' | 'video');
    setCurrentPage(1);
  };

  const getResourceIcon = (type: 'pdf' | 'video') => {
    return type === 'pdf' ? '📄' : '🎥';
  };

  const getResourceColor = (type: 'pdf' | 'video') => {
    return type === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contenidos</h2>
          <p className="text-gray-600">Gestiona los recursos educativos</p>
        </div>
        {isAdmin && (
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Contenido
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título o descripción..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Grid */}
      {contents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">No hay contenidos</h3>
            <p className="text-gray-600 text-center mb-4">
              {search || typeFilter !== 'all' 
                ? 'No se encontraron contenidos con los filtros aplicados'
                : 'Aún no se han creado contenidos'
              }
            </p>
            {isAdmin && !search && typeFilter === 'all' && (
              <Button onClick={onCreate}>Crear primer contenido</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => (
            <Card key={content.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getResourceIcon(content.resourceType)}</span>
                    <Badge className={getResourceColor(content.resourceType)}>
                      {content.resourceType.toUpperCase()}
                    </Badge>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(content)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            disabled={deleting === content.id}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar contenido?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El contenido "{content.title}" será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(content.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                {content.description && (
                  <CardDescription className="line-clamp-2">
                    {content.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {contentAPI.formatDate(content.createdAt)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(content.resourceUrl, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}