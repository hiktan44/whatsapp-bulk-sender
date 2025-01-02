import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import Alert from '../ui/Alert';

const FileUploader = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    // Dosya uzantılarını kontrol et
    const validExtensions = ['.xlsx', '.xls', '.csv', '.vcf', '.pdf'];
    const invalidFiles = acceptedFiles.filter(file => {
      const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      return !validExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      setError('Sadece Excel, CSV, VCF ve PDF dosyaları kabul edilmektedir.');
      return;
    }

    setFiles(acceptedFiles);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/vcard': ['.vcf'],
      'text/x-vcard': ['.vcf'],
      'application/pdf': ['.pdf']
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      await onFileUpload(files);
      setFiles([]);
    } catch (error) {
      setError('Dosya yükleme hatası: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setError(null);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700'}
          hover:border-primary-500 dark:hover:border-primary-500`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isDragActive ? (
            'Dosyaları buraya bırakın...'
          ) : (
            'Dosyaları sürükleyip bırakın veya seçmek için tıklayın'
          )}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Excel, CSV, VCF ve PDF dosyaları desteklenmektedir
        </p>
      </div>

      {error && (
        <Alert variant="destructive" message={error} />
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full mt-4"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                İşleniyor...
              </>
            ) : (
              'Dosyaları Yükle'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader; 