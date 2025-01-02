import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { X, Plus } from 'lucide-react';

const GroupModal = ({ isOpen, onClose, contacts, selectedIds }) => {
  const [groupName, setGroupName] = useState('');

  if (!isOpen) return null;

  const selectedContacts = contacts.filter(contact => selectedIds.includes(contact.id));

  const handleCreateGroup = () => {
    // Grup oluşturma mantığı
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Yeni Grup Oluştur</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Grup Adı</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Grup adı girin"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Seçili Kişiler ({selectedContacts.length})</label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                {selectedContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between py-1">
                    <span>{contact.name} {contact.surname}</span>
                    <span className="text-sm text-gray-500">{contact.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedContacts.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Grup Oluştur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupModal;