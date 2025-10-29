"use client";
import React, { useState } from 'react';
import styles from "./admin.module.css";
import SideBar from '@/components/AdminPanel/SideBar/SideBar';
import Teams from '@/components/AdminPanel/Teams/Teams';
import Projects from '@/components/AdminPanel/Projects/Projects';
import Forms from '@/components/AdminPanel/Forms/Forms';
import ClientRequests from '@/components/AdminPanel/ClientRequests/ClientRequests';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('teams');

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'teams':
        return <Teams />;
      case 'projects':
        return <Projects />;
      case 'forms':
        return <Forms />;
      case 'requests':
        return <ClientRequests />;
      default:
        return <Teams />;
    }
  };

  return (
    <div className={styles.container}>
      <SideBar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <main className={styles.mainContent}>
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default AdminPage;