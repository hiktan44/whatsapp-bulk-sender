import React, { useState, useRef } from 'react';
import { Card } from '../../components/ui/card';
import FileUploader from '../../components/dashboard/FileUploader';
import { processFile, generateWhatsAppLink, processPhoneNumber, openWhatsApp } from '../../services/fileService';
import { Settings, Users, MessageCircle, ExternalLink, Plus, Image, FileText, Video, X, Search, Edit2, Save, Download, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    surname: '',
    phone: '',
    company: ''
  });
  const textareaRef = useRef(null);
  const contactsPerPage = 50;
  const [salutation, setSalutation] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingContact, setEditingContact] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    phone: '',
    company: ''
  });
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showSendPreview, setShowSendPreview] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  // Hitap şekilleri listesi
  const salutations = [
    { value: 'Sayın', label: 'Sayın' },
    { value: 'Değerli', label: 'Değerli' },
    { value: 'Sevgili', label: 'Sevgili' },
    { value: 'Merhaba', label: 'Merhaba' },
    { value: 'İyi günler', label: 'İyi günler' }
  ];

  // Sayfalandırma hesaplamaları
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFileUpload = async (files) => {
    setIsLoading(true);
    try {
      const allContacts = [];
      for (const file of files) {
        const fileContacts = await processFile(file);
        allContacts.push(...fileContacts);
      }
      setContacts(prev => [...prev, ...allContacts]);
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = `${before}{${variable}}${after}`;
    setMessage(newText);
    
    // Cursor'ı eklenen değişkenin sonuna getir
    const newCursorPos = start + variable.length + 2;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleManualAdd = () => {
    if (!newContact.name || !newContact.phone) {
      // Hata göster
      return;
    }

    const phoneResult = processPhoneNumber(newContact.phone);
    if (!phoneResult.isValid) {
      // Hata göster
      return;
    }

    setContacts(prev => [...prev, {
      ...newContact,
      phone: phoneResult.number
    }]);

    // Formu temizle
    setNewContact({
      name: '',
      surname: '',
      phone: '',
      company: ''
    });
    setShowManualAdd(false);
  };

  // Mesaj gönderme önizleme fonksiyonu
  const handleSendPreview = () => {
    // Seçili kişileri veya mevcut sayfadaki kişileri al
    const recipients = selectedContacts.length > 0 
      ? selectedContacts 
      : currentContacts;

    setSelectedRecipients(recipients);
    setShowSendPreview(true);
  };

  // Mesaj gönderme fonksiyonu
  const handleSendMessage = async () => {
    if (!message.trim() || selectedRecipients.length === 0) return;

    try {
      setIsLoading(true);
      
      // İlk kişi için WhatsApp'ı aç
      const firstContact = selectedRecipients[0];
      let personalizedMessage = message;
      
      // Hitap şeklini ekle
      if (salutation && firstContact.name) {
        const fullName = [firstContact.name, firstContact.surname].filter(Boolean).join(' ');
        personalizedMessage = `${salutation} ${fullName},\n\n${personalizedMessage}`;
      }
      
      // Değişkenleri değiştir
      personalizedMessage = personalizedMessage
        .replace(/{isim}/g, firstContact.name || '')
        .replace(/{soyisim}/g, firstContact.surname || '')
        .replace(/{firma}/g, firstContact.company || '');

      // WhatsApp'ı aç
      await openWhatsApp(firstContact.phone, personalizedMessage, attachments);
      
      // Formu temizle
      setShowSendPreview(false);
      setAttachments([]);
      setMessage('');
      setSalutation('');

    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 50 * 1024 * 1024; // 50MB limit

    const validFiles = files.filter(file => {
      // Dosya boyutu kontrolü
      if (file.size > maxSize) {
        alert(`${file.name} dosyası çok büyük (max: 50MB)`);
        return false;
      }

      // Dosya tipi kontrolü
      const validTypes = {
        'image': ['jpeg', 'jpg', 'png', 'gif'],
        'video': ['mp4', 'mov', 'avi'],
        'application': ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
        'text': ['csv']
      };

      const [type, ext] = file.type.split('/');
      // Excel dosyaları için özel kontrol
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        return true;
      }
      
      // Diğer dosya tipleri için kontrol
      if (!validTypes[type] || !validTypes[type].includes(ext)) {
        alert(`${file.name} desteklenmeyen bir dosya türü`);
        return false;
      }

      return true;
    });

    const newAttachments = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: file.type.split('/')[0],
      url: URL.createObjectURL(file)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const filtered = prev.filter(att => att.id !== id);
      // URL'leri temizle
      prev.forEach(att => {
        if (att.id === id) URL.revokeObjectURL(att.url);
      });
      return filtered;
    });
  };

  const openPreview = () => {
    setShowPreview(true);
  };

  // Arama fonksiyonu
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.surname?.toLowerCase().includes(searchLower) ||
      contact.phone?.includes(searchTerm) ||
      contact.company?.toLowerCase().includes(searchLower)
    );
  });

  // Düzenleme fonksiyonları
  const startEditing = (contact) => {
    setEditingContact(contact);
    setEditForm({
      name: contact.name,
      surname: contact.surname,
      phone: contact.phone,
      company: contact.company
    });
  };

  const saveEdit = () => {
    const phoneResult = processPhoneNumber(editForm.phone);
    if (!phoneResult.isValid) {
      alert('Geçersiz telefon numarası');
      return;
    }

    setContacts(prev => prev.map(contact => 
      contact === editingContact
        ? { ...editForm, phone: phoneResult.number }
        : contact
    ));
    setEditingContact(null);
  };

  // Dosyaya kaydetme fonksiyonu
  const saveToFile = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(contacts.map(contact => ({
      'İsim': contact.name,
      'Soyisim': contact.surname,
      'Telefon': contact.phone,
      'Firma': contact.company
    })));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kişiler');
    XLSX.writeFile(workbook, 'whatsapp-contacts.xlsx');
  };

  // Kişi seçme fonksiyonu
  const toggleContactSelection = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.phone === contact.phone);
      if (isSelected) {
        return prev.filter(c => c.phone !== contact.phone);
      } else {
        return [...prev, contact];
      }
    });
  };

  // Grup oluşturma fonksiyonu
  const createGroup = () => {
    if (!newGroupName.trim() || selectedContacts.length === 0) return;

    setGroups(prev => [...prev, {
      id: Date.now(),
      name: newGroupName,
      contacts: selectedContacts
    }]);

    setNewGroupName('');
    setSelectedContacts([]);
    setShowGroupModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            WhatsApp Sender Dashboard
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Upload and Message Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload Section */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">
                  Kişi Yükleme
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowManualAdd(!showManualAdd)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Manuel Ekle
                </Button>
              </div>

              {showManualAdd ? (
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="İsim"
                      className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                      value={newContact.name}
                      onChange={e => setNewContact({...newContact, name: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Soyisim"
                      className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                      value={newContact.surname}
                      onChange={e => setNewContact({...newContact, surname: e.target.value})}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Telefon"
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                    value={newContact.phone}
                    onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Firma"
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                    value={newContact.company}
                    onChange={e => setNewContact({...newContact, company: e.target.value})}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowManualAdd(false)}
                    >
                      İptal
                    </Button>
                    <Button onClick={handleManualAdd}>
                      Ekle
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploader onFileUpload={handleFileUpload} />
              )}
            </Card>

            {/* Message Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Mesaj İçeriği
              </h2>
              <div className="space-y-4">
                {/* Hitap Seçimi */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">
                    Hitap Şekli
                  </label>
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Hitap şekli seçin</option>
                    {salutations.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medya Yükleme */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept="image/*,video/*,application/*"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Görsel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Dosya
                  </Button>
                </div>

                {/* Eklenen Medyalar */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-lg dark:border-gray-700">
                    {attachments.map(att => (
                      <div 
                        key={att.id}
                        className="relative group"
                      >
                        {att.type === 'image' ? (
                          <img 
                            src={att.url} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded cursor-pointer"
                            onClick={openPreview}
                          />
                        ) : att.type === 'video' ? (
                          <video 
                            src={att.url} 
                            className="w-20 h-20 object-cover rounded cursor-pointer"
                            onClick={openPreview}
                          />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <button
                          onClick={() => removeAttachment(att.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1
                            opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mesaj Alanı */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-[150px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 
                    focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mesajınızı yazın..."
                />

                {/* Değişkenler ve Gönder Butonu */}
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Değişkenler:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['isim', 'soyisim', 'firma'].map((variable) => (
                      <button
                        key={variable}
                        onClick={() => insertVariable(variable)}
                        className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 
                          rounded hover:bg-gray-200 dark:hover:bg-gray-600 
                          text-gray-700 dark:text-gray-300"
                      >
                        {"{" + variable + "}"}
                      </button>
                    ))}
                  </div>
                  <Button 
                    className="bg-primary-500 hover:bg-primary-600 mt-2"
                    onClick={handleSendPreview}
                    disabled={isLoading || !message.trim() || contacts.length === 0}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Contacts Preview Section */}
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold dark:text-white">
                  Yüklenen Kişiler
                </h2>
                <div className="flex items-center gap-4">
                  {/* Grup Oluştur Butonu */}
                  {selectedContacts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGroupModal(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Grup Oluştur ({selectedContacts.length})
                    </Button>
                  )}

                  {/* Arama Kutusu */}
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                        bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Kaydet Butonu */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveToFile}
                    disabled={contacts.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Excel Olarak Kaydet
                  </Button>

                  {/* Sayfalama */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Önceki
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Sayfa {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              </div>

              {/* Gruplar */}
              {groups.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {groups.map(group => (
                    <div
                      key={group.id}
                      className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 
                        rounded-full text-sm text-primary-700 dark:text-primary-300"
                    >
                      <Users className="h-4 w-4" />
                      {group.name} ({group.contacts.length})
                    </div>
                  ))}
                </div>
              )}

              {/* Kişi Listesi */}
              <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                    <tr className="border-b dark:border-gray-700">
                      <th className="w-8 py-3 px-4">
                        <input
                          type="checkbox"
                          checked={currentContacts.length > 0 && selectedContacts.length === currentContacts.length}
                          onChange={() => {
                            if (selectedContacts.length === currentContacts.length) {
                              setSelectedContacts([]);
                            } else {
                              setSelectedContacts(currentContacts);
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </th>
                      <th className="text-left py-3 px-4">İsim</th>
                      <th className="text-left py-3 px-4">Soyisim</th>
                      <th className="text-left py-3 px-4">Telefon</th>
                      <th className="text-left py-3 px-4">Firma</th>
                      <th className="text-right py-3 px-4">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContacts.map((contact, index) => (
                      <tr 
                        key={index}
                        className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800
                          ${selectedContacts.some(c => c.phone === contact.phone) ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                      >
                        <td className="w-8 py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedContacts.some(c => c.phone === contact.phone)}
                            onChange={() => toggleContactSelection(contact)}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        {editingContact === contact ? (
                          <>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full p-1 rounded border dark:border-gray-700 dark:bg-gray-800"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={editForm.surname}
                                onChange={(e) => setEditForm({...editForm, surname: e.target.value})}
                                className="w-full p-1 rounded border dark:border-gray-700 dark:bg-gray-800"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                className="w-full p-1 rounded border dark:border-gray-700 dark:bg-gray-800"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={editForm.company}
                                onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                                className="w-full p-1 rounded border dark:border-gray-700 dark:bg-gray-800"
                              />
                            </td>
                            <td className="py-2 px-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={saveEdit}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4">{contact.name}</td>
                            <td className="py-3 px-4">{contact.surname}</td>
                            <td className="py-3 px-4">{contact.phone}</td>
                            <td className="py-3 px-4">{contact.company}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(contact)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openWhatsApp(contact.phone)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Mesaj Gönderme Önizleme Modalı */}
          {showSendPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Mesaj Gönderme Onayı</h3>
                  <button onClick={() => setShowSendPreview(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Alıcı Listesi */}
                  <div>
                    <h4 className="font-medium mb-2">Alıcılar ({selectedRecipients.length} kişi)</h4>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                      {selectedRecipients.map((contact, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <span>{contact.name} {contact.surname}</span>
                          <span className="text-sm text-gray-500">{contact.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medya Önizleme */}
                  {attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Ekli Medyalar</h4>
                      <div className="flex flex-wrap gap-4">
                        {attachments.map(att => (
                          <div key={att.id}>
                            {att.type === 'image' ? (
                              <img 
                                src={att.url} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded"
                              />
                            ) : att.type === 'video' ? (
                              <video 
                                src={att.url} 
                                className="w-32 h-32 object-cover rounded"
                                controls
                              />
                            ) : (
                              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                                <FileText className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mesaj Önizleme */}
                  <div>
                    <h4 className="font-medium mb-2">Mesaj İçeriği</h4>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="prose dark:prose-invert">
                        {salutation && <p>{salutation} [Alıcı Adı],</p>}
                        <p>{message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Onay Butonları */}
                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowSendPreview(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Onayla ve Gönder
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grup Oluşturma Modalı */}
          {showGroupModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Yeni Grup Oluştur</h3>
                <input
                  type="text"
                  placeholder="Grup adı"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-2 rounded border dark:border-gray-700 dark:bg-gray-900 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowGroupModal(false)}
                  >
                    İptal
                  </Button>
                  <Button onClick={createGroup}>
                    Oluştur
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;