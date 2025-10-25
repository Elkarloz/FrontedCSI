/**
 * AuthPage - Página de autenticación con el diseño original
 * Mantiene el diseño cyberpunk y la funcionalidad original
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield.jsx';
import { userController } from '../controllers/userController.js';
import { Button, Input } from '../components/ui';
import { useToast } from '../components/Toast.jsx';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        console.log('🔐 Iniciando proceso de login...');
        const result = await userController.login({
          email: formData.email,
          password: formData.password
        });
        
        console.log('🔐 Resultado del login:', result);
        
        if (result.success) {
          console.log('✅ Login exitoso, verificando rol del usuario...');
          console.log('👤 Usuario logueado:', result.data?.user);
          console.log('🔍 Rol del usuario:', result.data?.user?.role);
          console.log('🔍 Tipo de rol:', typeof result.data?.user?.role);
          
          // Verificar si es admin y redirigir apropiadamente
          if (result.data?.user?.role === 'admin') {
            console.log('👑 Usuario admin detectado, redirigiendo a /admin');
            setTimeout(() => {
              navigate('/admin');
            }, 100);
          } else if (result.data?.user?.role === 'student') {
            console.log('👤 Usuario estudiante detectado, redirigiendo a /student');
            setTimeout(() => {
              navigate('/student');
            }, 100);
          } else {
            console.log('👤 Usuario normal, redirigiendo a /space-map');
            console.log('⚠️ Rol no reconocido:', result.data?.user?.role);
            setTimeout(() => {
              navigate('/space-map');
            }, 100);
          }
        } else {
          console.log('❌ Error en login:', result.message);
          setError(result.message);
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        
        const result = await userController.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student'
        });
        
        if (result.success) {
          setError('');
          setIsLogin(true);
          showSuccess('Usuario creado correctamente. Ahora puedes iniciar sesión.', 'Registro exitoso');
        } else {
          setError(result.message);
          showError(result.message, 'Error al crear usuario');
        }
      }
    } catch (error) {
      console.error('💥 Error inesperado en login:', error);
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Starfield />

      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-mono text-3xl md:text-4xl mb-4 neon-text text-[#00f0ff]">
            {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#00ff88] to-transparent glow-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <Input
              type="text"
              name="name"
              label="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              placeholder="Ingresa tu nombre completo"
            />
          )}

          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />

          <Input
            type="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />

          {!isLogin && (
            <Input
              type="password"
              name="confirmPassword"
              label="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!isLogin}
              placeholder="••••••••"
            />
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            className="w-full border border-cyan-400"
            style={{marginTop: '30px'}}
          >
            {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
          </Button>
        </form>

        {/* Toggle between login/register */}
        <div className="text-center mt-6">
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Button>
        </div>

        {/* Back button */}
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
