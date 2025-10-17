"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { NeonButton } from "@/components/neon-button";
import { BackButton } from "@/components/back-button";
import { ContentForm } from "@/components/admin/content-form";
import { adminAPI } from "@/lib/api";
import { Content as ApiContent } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { tokenUtils } from "@/lib/api/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Content {
  id: string;
  title: string;
  description: string;
  level: string;
  type: string;
  resourceUrl?: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalContents: number;
  totalQuizzes: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "users" | "contents"
  >("dashboard");
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContents: 0,
    totalQuizzes: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ApiContent | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoading) {
      console.log('[admin/page] isAuthenticated?', isAuthenticated, 'user:', user)
      console.log('[admin/page] user.role:', user?.role, 'typeof:', typeof user?.role)
      console.log('[admin/page] comparison:', user?.role !== 'admin')
      if (!isAuthenticated || user?.role !== 'admin') {
        console.log('[admin/page] Redirigiendo a / - razones:', { 
          isAuthenticated, 
          userRole: user?.role, 
          isNotAdmin: user?.role !== 'admin' 
        })
        router.push('/');
        return;
      }
      loadDashboardData();
    }
  }, [mounted, isLoading, isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('[admin/page] Intentando cargar dashboard...')
      const dashboardData = await adminAPI.getDashboard();
      console.log('[admin/page] Dashboard response:', dashboardData)
      
      if (dashboardData.success && dashboardData.data) {
        setStats({
          totalUsers: dashboardData.data.stats.totalUsers,
          totalContents: dashboardData.data.stats.totalContents,
          totalQuizzes: 0, // Por ahora no hay quizzes implementados
        });

        // Los contenidos recientes vienen del dashboard
        const recentContents = dashboardData.data.recentContents || [];
        setContents(
          recentContents.map((content: any) => ({
            id: content.id.toString(),
            title: content.title,
            description: content.description,
            level: "1", // Por defecto, ya que no tenemos niveles implementados
            type: content.resourceType,
            resourceUrl: content.resourceUrl,
            createdAt: content.createdAt,
          }))
        );
      }

      // Por ahora simular usuarios hasta implementar endpoint de usuarios
      setUsers([
        {
          id: "1",
          name: "Administrador",
          email: "admin@test.com",
          role: "admin",
          createdAt: "2024-01-15",
        },
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      // En caso de error, mostrar datos vacíos en lugar de datos simulados
      setStats({ totalUsers: 0, totalContents: 0, totalQuizzes: 0 });
      setUsers([]);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        // Usar API centralizada
        // await adminApi.deleteUser(id)

        // Simulación - remover cuando conectes con la API real
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error eliminando usuario:", error);
      }
    }
  };

  const handleCreateContent = () => {
    setEditingContent(null);
    setShowCreateForm(true);
  };

  const handleEditContent = (content: Content) => {
    // Convertir el tipo local al tipo de la API
    const apiContent: ApiContent = {
      id: parseInt(content.id),
      title: content.title,
      description: content.description,
      resourceType: content.type as 'pdf' | 'video',
      resourceUrl: content.resourceUrl || '',
      createdBy: 1, // Por defecto, ya que no tenemos este campo
      creatorName: 'Admin',
      createdAt: content.createdAt,
      updatedAt: content.createdAt
    };
    setEditingContent(apiContent);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingContent(null);
  };

  const handleContentSaved = () => {
    setShowCreateForm(false);
    setEditingContent(null);
    loadDashboardData(); // Recargar datos
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este contenido?")) {
      try {
        // Usar tokenUtils para obtener el token correctamente
        const token = tokenUtils.getToken();
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTENTS}/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Actualizar la lista local
            setContents(contents.filter((content) => content.id !== id));
            // Recargar datos del dashboard para actualizar stats
            loadDashboardData();
          } else {
            alert("Error al eliminar contenido: " + data.message);
          }
        } else {
          alert("Error al eliminar contenido");
        }
      } catch (error) {
        console.error("Error eliminando contenido:", error);
        alert("Error de conexión al eliminar contenido");
      }
    }
  };

  const filteredContents =
    filterLevel === "all"
      ? contents
      : contents.filter((c) => c.level === filterLevel);

  if (!mounted) return null;

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="holographic rounded-lg p-6 text-center">
          <h3 className="font-mono text-2xl text-[#00f0ff] mb-2">
            {stats.totalUsers}
          </h3>
          <p className="font-sans text-[#00ff88]">Usuarios Registrados</p>
        </div>
        <div className="holographic rounded-lg p-6 text-center">
          <h3 className="font-mono text-2xl text-[#ff00ff] mb-2">
            {stats.totalContents}
          </h3>
          <p className="font-sans text-[#00ff88]">Contenidos Teóricos</p>
        </div>
        <div className="holographic rounded-lg p-6 text-center">
          <h3 className="font-mono text-2xl text-[#00ff88] mb-2">
            {stats.totalQuizzes}
          </h3>
          <p className="font-sans text-[#00ff88]">Quizzes Completados</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="holographic rounded-lg p-6">
        <h2 className="font-mono text-xl text-[#00f0ff] mb-6">
          ACCIONES RÁPIDAS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-black/30 border border-[#00f0ff]/20 rounded-lg p-6 hover:border-[#00f0ff]/50 transition-colors cursor-pointer"
            onClick={() => setActiveSection("users")}
          >
            <h3 className="font-mono text-lg text-[#00f0ff] mb-2">
              GESTIONAR USUARIOS
            </h3>
            <p className="font-sans text-[#00ff88]/80 text-sm">
              Ver y administrar cuentas de usuario
            </p>
          </div>
          <div
            className="bg-black/30 border border-[#ff00ff]/20 rounded-lg p-6 hover:border-[#ff00ff]/50 transition-colors cursor-pointer"
            onClick={() => setActiveSection("contents")}
          >
            <h3 className="font-mono text-lg text-[#ff00ff] mb-2">
              CONTENIDOS TEÓRICOS
            </h3>
            <p className="font-sans text-[#00ff88]/80 text-sm">
              Crear y editar recursos educativos
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="holographic rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-xl text-[#00f0ff]">
            USUARIOS ({users.length})
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-sans text-[#00ff88]/60">
              No hay usuarios registrados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-black/30 border border-[#00f0ff]/20 rounded-lg p-4 hover:border-[#00f0ff]/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`font-mono text-xs px-2 py-1 rounded ${
                          user.role === "admin"
                            ? "text-[#ff00ff] bg-[#ff00ff]/10"
                            : "text-[#00f0ff] bg-[#00f0ff]/10"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-[#00ff88]/60">
                        {user.createdAt}
                      </span>
                    </div>
                    <h3 className="font-sans text-white mb-1">{user.name}</h3>
                    <p className="font-sans text-[#00ff88]/80 text-sm">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => console.log("Edit user:", user.id)}
                      className="text-[#00f0ff] hover:text-[#00f0ff]/80 font-sans text-sm transition-colors"
                    >
                      Editar
                    </button>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 font-sans text-sm transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <NeonButton onClick={handleCreateContent}>
          + CREAR CONTENIDO
        </NeonButton>
      </div>

      <div className="holographic rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-xl text-[#00f0ff]">
            CONTENIDOS ({filteredContents.length})
          </h2>
        </div>

        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-sans text-[#00ff88]/60">
              No hay contenidos creados. Crea tu primer contenido.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                className="bg-black/30 border border-[#00f0ff]/20 rounded-lg p-4 hover:border-[#00f0ff]/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-[#ff00ff] bg-[#ff00ff]/10 px-2 py-1 rounded">
                        NIVEL {content.level}
                      </span>
                      <span className="font-mono text-xs text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-1 rounded">
                        {content.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-[#00ff88]/60">
                        {content.createdAt}
                      </span>
                    </div>
                    <h3 className="font-sans text-white mb-2">
                      {content.title}
                    </h3>
                    <p className="font-sans text-[#00ff88]/80 text-sm mb-3">
                      {content.description}
                    </p>
                    {content.resourceUrl && (
                      <a
                        href={content.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[#00f0ff] text-sm hover:text-[#00f0ff]/80 transition-colors"
                      >
                        Ver recurso →
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditContent(content)}
                      className="text-[#00f0ff] hover:text-[#00f0ff]/80 font-sans text-sm transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="text-red-400 hover:text-red-300 font-sans text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <BackButton />
          <NeonButton variant="secondary" onClick={handleLogout}>
            CERRAR SESIÓN
          </NeonButton>
        </div>

        <div className="text-center mb-12 scanlines">
          <h1 className="font-mono text-3xl md:text-5xl mb-4 neon-text text-[#ff00ff] leading-tight">
            PANEL DE ADMINISTRACIÓN
          </h1>
          <p className="font-sans text-base md:text-lg text-[#00ff88] leading-relaxed">
            {"> "} Centro de control del sistema {"<"}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="holographic rounded-lg p-2">
            <div className="flex gap-2">
              {[
                { key: "dashboard", label: "DASHBOARD" },
                { key: "users", label: "USUARIOS" },
                { key: "contents", label: "CONTENIDOS" },
              ].map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as any)}
                  className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
                    activeSection === section.key
                      ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50"
                      : "text-[#00ff88]/60 hover:text-[#00ff88] hover:bg-[#00ff88]/10"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="font-sans text-[#00ff88]">Cargando datos...</p>
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && renderDashboard()}
              {activeSection === "users" && renderUsers()}
              {activeSection === "contents" && renderContents()}
            </>
          )}
        </div>
      </div>

      {/* Modal del formulario de contenido */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <ContentForm
                content={editingContent}
                onSuccess={handleContentSaved}
                onCancel={handleCloseForm}
                isEdit={!!editingContent}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
