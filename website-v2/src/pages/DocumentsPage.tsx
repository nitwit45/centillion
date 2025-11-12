import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FileText, Upload, Trash2, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
}

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load documents from localStorage
    if (user) {
      const savedDocs = localStorage.getItem(`documents_${user.id}`);
      if (savedDocs) {
        setDocuments(JSON.parse(savedDocs));
      }
    }
  }, [user]);

  const saveDocuments = (docs: Document[]) => {
    if (user) {
      localStorage.setItem(`documents_${user.id}`, JSON.stringify(docs));
      setDocuments(docs);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newDocuments: Document[] = Array.from(files).map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString(),
        type: file.type || 'application/octet-stream',
      }));

      saveDocuments([...documents, ...newDocuments]);
      setUploading(false);
      
      // Reset input
      event.target.value = '';
    }, 1500);
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    saveDocuments(updatedDocs);
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

  const requiredDocuments = [
    {
      title: 'Consent Form',
      description: 'Signed consent form for beauty treatment procedures',
      required: true,
    },
    {
      title: 'Medical History',
      description: 'Complete medical history and allergy information',
      required: true,
    },
    {
      title: 'ID Proof',
      description: 'Valid government-issued identification document',
      required: true,
    },
    {
      title: 'Passport Copy',
      description: 'Clear copy of your passport (if traveling internationally)',
      required: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-muted-foreground">
          Upload and manage your signed documents and medical records.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload your signed consent forms, medical records, and identification documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload your documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop or click to browse (PDF, DOC, JPG, PNG - Max 10MB)
                </p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Documents Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Please ensure all required documents are uploaded before submitting your treatment form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-background">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {doc.title}
                      {doc.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                {documents.length} document(s) uploaded
              </CardDescription>
            </div>
            {documents.length > 0 && (
              <Badge variant="outline">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {documents.length} Files
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your documents to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{getFileIcon(doc.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => alert('Download functionality - In production, this would download the file')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;

