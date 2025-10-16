'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { contentAPI } from '@/lib/content-api';
import { FileText, Video, TrendingUp, BarChart3 } from 'lucide-react';

interface ContentStats {
  total: number;
  pdf: number;
  video: number;
  breakdown: {
    pdfPercentage: string;
    videoPercentage: string;
  };
}

export function ContentStats() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de contenidos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contenidos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total === 1 ? 'recurso educativo' : 'recursos educativos'}
          </p>
        </CardContent>
      </Card>

      {/* Contenidos PDF */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documentos PDF</CardTitle>
          <FileText className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.pdf}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress 
              value={parseFloat(stats.breakdown.pdfPercentage)} 
              className="flex-1 h-2"
            />
            <Badge variant="secondary" className="text-xs">
              {stats.breakdown.pdfPercentage}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contenidos Video */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Videos</CardTitle>
          <Video className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.video}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress 
              value={parseFloat(stats.breakdown.videoPercentage)} 
              className="flex-1 h-2"
            />
            <Badge variant="secondary" className="text-xs">
              {stats.breakdown.videoPercentage}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Distribución */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribución</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">PDF</span>
              </div>
              <span className="text-sm font-medium">{stats.pdf}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Video</span>
              </div>
              <span className="text-sm font-medium">{stats.video}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente simplificado para mostrar solo el total
export function ContentStatsSimple() {
  const [totalContents, setTotalContents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTotalContents = async () => {
      try {
        const response = await contentAPI.getAll({ limit: 1 });
        setTotalContents(response.data.pagination.total);
      } catch (error) {
        console.error('Error loading total contents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTotalContents();
  }, []);

  if (loading) {
    return <span className="animate-pulse">...</span>;
  }

  return (
    <Badge variant="secondary">
      {totalContents} {totalContents === 1 ? 'contenido' : 'contenidos'}
    </Badge>
  );
}