import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { X } from 'lucide-react';

const WhatsAppQRModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">WhatsApp Web'e Bağlan</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                QR Kod burada görünecek
              </div>
            </div>
            
            <p className="text-center text-gray-600">
              WhatsApp Web'i açın ve QR kodu telefonunuzla tarayın
            </p>

            <div className="pt-4">
              <Button className="w-full" onClick={onClose}>
                Bağlandım
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppQRModal;