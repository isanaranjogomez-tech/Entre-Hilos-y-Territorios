import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { settings } from '@/content/project';
import { Layout } from './Layout';
import HomePage from '@/pages/HomePage';

// Each chapter is its own chunk, so the 3D code only loads on /matematicas.
const MathematicsPage = lazy(() => import('@/pages/MathematicsPage'));
const SciencePage = lazy(() => import('@/pages/SciencePage'));
const PhysicsPage = lazy(() => import('@/pages/PhysicsPage'));
const EnglishPage = lazy(() => import('@/pages/EnglishPage'));
const EssayPage = lazy(() => import('@/pages/EssayPage'));

const page = (el: ReactNode) => <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>{el}</Suspense>;

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/matematicas', element: page(<MathematicsPage />) },
        { path: '/ciencias', element: page(<SciencePage />) },
        ...(settings.physicsMode !== 'hidden' ? [{ path: '/fisica', element: page(<PhysicsPage />) }] : []),
        { path: '/ingles', element: page(<EnglishPage />) },
        { path: '/lenguaje-sociales', element: page(<EssayPage />) },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
