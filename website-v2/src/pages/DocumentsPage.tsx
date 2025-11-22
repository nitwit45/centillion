import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FileText, Upload, Trash2, Download, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
  category: string;
}

type DocumentCategory = 'consent_form' | 'medical_history' | 'id_proof' | 'passport_copy';

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingCategories, setUploadingCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load documents from backend
    const fetchDocuments = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5001/api/documents', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.success) {
            const formattedDocs = data.documents.map((doc: any) => ({
              id: doc.id,
              name: doc.name,
              size: formatFileSize(doc.size),
              uploadedAt: doc.uploadedAt,
              type: doc.mimeType,
              category: doc.category,
            }));
            setDocuments(formattedDocs);
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      }
    };

    fetchDocuments();
  }, [user]);

  const handleFileUpload = async (category: DocumentCategory, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingCategories(prev => [...prev, category]);

    const file = files[0]; // Take only the first file
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/documents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: file.name,
            originalName: file.name,
            size: file.size,
            mimeType: file.type || 'application/octet-stream',
            category,
            fileData,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Add new document to list
          const newDoc: Document = {
            id: data.document.id,
            name: data.document.name,
            size: formatFileSize(data.document.size),
            uploadedAt: data.document.uploadedAt,
            type: data.document.mimeType,
            category: data.document.category,
          };
          
          // Replace existing document in same category or add new
          const updatedDocs = documents.filter(doc => doc.category !== category);
          setDocuments([...updatedDocs, newDoc]);
        } else {
          alert(`Error uploading document: ${data.error}`);
        }
        
        setUploadingCategories(prev => prev.filter(cat => cat !== category));
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document. Please try again.');
      setUploadingCategories(prev => prev.filter(cat => cat !== category));
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const updatedDocs = documents.filter(doc => doc.id !== docId);
        setDocuments(updatedDocs);
      } else {
        alert(`Error deleting document: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting document. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  const documentCategories = [
    {
      key: 'consent_form' as DocumentCategory,
      title: 'Consent Form',
      description: 'Signed consent form for beauty treatment procedures',
      required: true,
      icon: '📝',
    },
    {
      key: 'medical_history' as DocumentCategory,
      title: 'Medical History',
      description: 'Complete medical history and allergy information',
      required: true,
      icon: '🏥',
    },
    {
      key: 'id_proof' as DocumentCategory,
      title: 'ID Proof',
      description: 'Valid government-issued identification document',
      required: true,
      icon: '🆔',
    },
    {
      key: 'passport_copy' as DocumentCategory,
      title: 'Passport Copy',
      description: 'Clear copy of your passport (if traveling internationally)',
      required: false,
      icon: '🛂',
    },
  ];

  const getDocumentsByCategory = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  const getTotalUploadedDocuments = () => {
    return documents.length;
  };

  const getRequiredDocumentsUploaded = () => {
    return documentCategories.filter(cat => cat.required && getDocumentsByCategory(cat.key).length > 0).length;
  };

  const getTotalRequiredDocuments = () => {
    return documentCategories.filter(cat => cat.required).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-muted-foreground">
          Upload and manage your signed documents and medical records.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
              <div>
              <h3 className="font-semibold">Document Upload Progress</h3>
              <p className="text-sm text-muted-foreground">
                {getRequiredDocumentsUploaded()} of {getTotalRequiredDocuments()} required documents uploaded
              </p>
            </div>
            <Badge variant={getRequiredDocumentsUploaded() === getTotalRequiredDocuments() ? "default" : "secondary"}>
              {getRequiredDocumentsUploaded()}/{getTotalRequiredDocuments()} Required
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getRequiredDocumentsUploaded() / getTotalRequiredDocuments()) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {documentCategories.map((category) => {
          const categoryDocs = getDocumentsByCategory(category.key);
          const isUploading = uploadingCategories.includes(category.key);
          const hasDocuments = categoryDocs.length > 0;

          return (
            <Card key={category.key} className={`${hasDocuments ? 'ring-2 ring-primary/20' : ''}`}>
        <CardHeader>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                  <div>
                      <CardTitle className="flex items-center gap-2">
                        {category.title}
                        {category.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                  {hasDocuments && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {categoryDocs.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
                {hasDocuments ? (
            <div className="space-y-2">
                    {categoryDocs.map((doc) => (
                <div
                  key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg">{getFileIcon(doc.type)}</span>
                    <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                              {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                        <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                            className="h-8 w-8"
                      onClick={() => alert('Download functionality - In production, this would download the file')}
                    >
                            <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                            className="h-8 w-8"
                      onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-muted">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">No documents uploaded</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Upload your {category.title.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(category.key, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Upload {category.title}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
        </CardContent>
      </Card>
          );
        })}
      </div>

      {/* Information Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">Important Information</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>All documents must be clear and legible</li>
                <li>Signed consent forms are required before treatment</li>
                <li>Your documents are stored securely and kept confidential</li>
                <li>Maximum file size: 10MB per document</li>
                <li>Supported formats: PDF, DOC, DOCX, JPG, PNG</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;



