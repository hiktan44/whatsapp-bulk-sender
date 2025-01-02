import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { X } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Ayarlar</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp API Key</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Varsayılan Bekleme Süresi (sn)</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 p-2"
                defaultValue={15}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tema</label>
              <select className="w-full rounded-md border border-gray-300 p-2">
                <option value="light">Açık</option>
                <option value="dark">Koyu</option>
                <option value="system">Sistem</option>
              </select>
            </div>

            <div className="pt-4">
              <Button className="w-full">Kaydet</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModal;