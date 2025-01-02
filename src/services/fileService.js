import * as XLSX from 'xlsx';

// Telefon numarası işleme
export const processPhoneNumber = (number) => {
  let cleanNumber = number.toString().replace(/\D/g, '');
  
  if (cleanNumber.length === 10 && cleanNumber.startsWith('5')) {
    cleanNumber = '90' + cleanNumber;
  } else if (cleanNumber.startsWith('05')) {
    cleanNumber = '9' + cleanNumber.substring(1);
  } else if (!cleanNumber.startsWith('90')) {
    cleanNumber = '90' + cleanNumber;
  }

  cleanNumber = cleanNumber.startsWith('+') ? cleanNumber : '+' + cleanNumber;
  
  const isValid = 
    cleanNumber.length === 13 && 
    cleanNumber.startsWith('+90') && 
    cleanNumber.substring(3, 4) === '5';
  
  return {
    number: cleanNumber,
    isValid
  };
};

// Dosya işleme
export const processFile = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          let contacts = [];

          const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
          
          if (extension === '.vcf') {
            contacts = processVCard(data);
          } else if (extension === '.csv') {
            contacts = processContacts(data);
          } else if (extension === '.xlsx' || extension === '.xls') {
            const binary = new Uint8Array(data);
            let binaryString = '';
            for (let i = 0; i < binary.length; i++) {
              binaryString += String.fromCharCode(binary[i]);
            }
            contacts = processExcel(binaryString);
          }

          resolve(contacts);
        } catch (error) {
          reject(error);
        }
      };

      if (file.name.match(/\.(xlsx|xls)$/)) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  } catch (error) {
    throw new Error('Dosya işleme hatası: ' + error.message);
  }
};

// WhatsApp mesaj gönderme
export const openWhatsApp = async (phone, message, attachments = []) => {
  try {
    // Telefon numarasını temizle
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Medya varsa
    if (attachments.length > 0) {
      try {
        // WhatsApp Web'i aç
        window.open('https://web.whatsapp.com', '_blank');

        // Kullanıcıya talimat ver
        alert(`Lütfen şu adımları izleyin:
1. WhatsApp Web'e giriş yapın
2. Sohbeti açın
3. Dosyaları sürükleyip bırakın veya ataş simgesini kullanın
4. Mesajı gönderin`);

        // Mesajı panoya kopyala
        await navigator.clipboard.writeText(message);
        alert('Mesaj panoya kopyalandı. Ctrl+V (⌘+V) ile yapıştırabilirsiniz.');

        return true;
      } catch (error) {
        console.error('Medya gönderme hatası:', error);
        // Hata durumunda normal WhatsApp'ı aç
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        return true;
      }
    } else {
      // Sadece mesaj gönder
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
      return true;
    }

  } catch (error) {
    console.error('WhatsApp hatası:', error);
    alert('Mesaj gönderilirken bir hata oluştu');
    return false;
  }
};

// WhatsApp link oluşturma
export const generateWhatsAppLink = (phone) => {
  const cleanNumber = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}`;
};

// Yardımcı fonksiyonlar
const processContacts = (fileData) => {
  try {
    const lines = fileData.split('\n');
    const contacts = [];

    const headers = lines[0].toLowerCase().split(',');
    const nameIndex = headers.findIndex(h => h.includes('ad') || h.includes('isim') || h.includes('name'));
    const surnameIndex = headers.findIndex(h => h.includes('soyad') || h.includes('surname'));
    const phoneIndex = headers.findIndex(h => h.includes('tel') || h.includes('phone') || h.includes('numara'));
    const companyIndex = headers.findIndex(h => h.includes('firma') || h.includes('şirket') || h.includes('company'));

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length > 1) {
        const phoneResult = processPhoneNumber(values[phoneIndex] || '');
        if (phoneResult.isValid) {
          contacts.push({
            id: i,
            name: values[nameIndex]?.trim() || '',
            surname: values[surnameIndex]?.trim() || '',
            phone: phoneResult.number,
            company: values[companyIndex]?.trim() || ''
          });
        }
      }
    }

    return contacts;
  } catch (error) {
    console.error('CSV işleme hatası:', error);
    throw error;
  }
};

const processExcel = (data) => {
  try {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    const contacts = [];

    if (rows.length < 2) return contacts;

    const headers = rows[0].map(h => h?.toString().toLowerCase() || '');
    const nameIndex = headers.findIndex(h => h.includes('ad') || h.includes('isim') || h.includes('name'));
    const surnameIndex = headers.findIndex(h => h.includes('soyad') || h.includes('surname'));
    const phoneIndex = headers.findIndex(h => h.includes('tel') || h.includes('phone') || h.includes('numara'));
    const companyIndex = headers.findIndex(h => h.includes('firma') || h.includes('şirket') || h.includes('company'));

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length > 1) {
        const phoneResult = processPhoneNumber(row[phoneIndex]?.toString() || '');
        if (phoneResult.isValid) {
          contacts.push({
            id: i,
            name: row[nameIndex]?.toString().trim() || '',
            surname: row[surnameIndex]?.toString().trim() || '',
            phone: phoneResult.number,
            company: row[companyIndex]?.toString().trim() || ''
          });
        }
      }
    }

    return contacts;
  } catch (error) {
    console.error('Excel işleme hatası:', error);
    throw error;
  }
};

const processVCard = (data) => {
  try {
    const contacts = [];
    const vcards = data.split('BEGIN:VCARD');

    for (let i = 1; i < vcards.length; i++) {
      const vcard = vcards[i];
      
      // İsim al
      const fnMatch = vcard.match(/FN:(.*)/);
      const fullName = fnMatch ? fnMatch[1].trim().split(' ') : [];
      
      // Telefon al
      const telMatch = vcard.match(/TEL[^:]*:(.*)/);
      if (telMatch) {
        const phoneResult = processPhoneNumber(telMatch[1]);
        if (phoneResult.isValid) {
          contacts.push({
            id: i,
            name: fullName[0] || '',
            surname: fullName.slice(1).join(' ') || '',
            phone: phoneResult.number,
            company: ''
          });
        }
      }
    }

    return contacts;
  } catch (error) {
    console.error('VCard işleme hatası:', error);
    throw error;
  }
};