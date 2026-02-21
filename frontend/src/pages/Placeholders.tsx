import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <h1 className="text-4xl font-bold text-white/50">{title}</h1>
  </div>
);

export const MyJobsPage: React.FC = () => <PlaceholderPage title="My Jobs" />;
export const ProfilePage: React.FC = () => <PlaceholderPage title="Profile" />;
export const SettingsPage: React.FC = () => <PlaceholderPage title="Settings" />;
