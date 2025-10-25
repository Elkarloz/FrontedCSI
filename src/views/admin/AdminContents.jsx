/**
 * AdminContents - Página de administración de contenidos
 * Maneja la gestión de materiales educativos
 */

import React from 'react';
import ContentList from '../../components/ContentList.jsx';

const AdminContents = () => {

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <ContentList />
      </div>
    </div>
  );
};


export default AdminContents;
