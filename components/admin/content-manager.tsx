'use client';

import React, { useState } from 'react';
import { ContentList } from './content-list';
import { ContentForm } from './content-form';
import { Content } from '@/lib/content-api';

type ViewMode = 'list' | 'create' | 'edit';

export function ContentManager() {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const handleCreate = () => {
    setSelectedContent(null);
    setCurrentView('create');
  };

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setCurrentView('edit');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedContent(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedContent(null);
  };

  if (currentView === 'create') {
    return (
      <ContentForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEdit={false}
      />
    );
  }

  if (currentView === 'edit' && selectedContent) {
    return (
      <ContentForm
        content={selectedContent}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEdit={true}
      />
    );
  }

  return (
    <ContentList
      onEdit={handleEdit}
      onCreate={handleCreate}
      isAdmin={true}
    />
  );
}