import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin, AdminUser } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
  category: string;
}

interface UserDocuments {
  user: AdminUser;
  documents: Document[];
  completionStatus: {
    total: number;
    required: number;
    uploaded: number;
  };
}

const AdminDocumentsPage: React.FC = () => {
  const { users, loading, error, fetchUsers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userDocuments, setUserDocuments] = useState<UserDocuments[]>([]);
  const [selectedUserDocs, setSelectedUserDocs] = useState<UserDocuments | null>(null);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
    loadUserDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadUserDocuments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const documentsData: UserDocuments[] = data.data.userDocuments.map((ud: any) => {
          const requiredCategories = ['consent_form', 'medical_history', 'id_proof'];
          const uploadedRequired = requiredCategories.filter(cat =>
            ud.documents.some((doc: any) => doc.category === cat)
          ).length;

          return {
            user: ud.user,
            documents: ud.documents.map((doc: any) => ({
              id: doc.id,
              name: doc.name,
              size: formatFileSize(doc.size),
              uploadedAt: doc.uploadedAt,
              type: doc.mimeType,
              category: doc.category,
            })),
            completionStatus: {
              total: 4,
              required: 3,
              uploaded: uploadedRequired
            }
          };
        });

        setUserDocuments(documentsData);
      }
    } catch (error) {
      console.error('Error fetching user documents:', error);
    }
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, itemsPerPage);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const viewUserDocuments = (userDocs: UserDocuments) => {
    setSelectedUserDocs(userDocs);
    setShowDocumentsDialog(true);
  };

  const getDocumentStatusBadge = (userDocs: UserDocuments) => {
    const { uploaded, required } = userDocs.completionStatus;

    if (uploaded === required) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Complete ({uploaded}/{required})
        </Badge>
      );
    } else if (uploaded > 0) {
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Partial ({uploaded}/{required})
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          <XCircle className="h-3 w-3 mr-1" />
          Missing ({uploaded}/{required})
        </Badge>
      );
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      consent_form: 'Consent Form',
      medical_history: 'Medical History',
      id_proof: 'ID Proof',
      passport_copy: 'Passport Copy'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const filteredUsers = userDocuments.filter(userDocs =>
    userDocs.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userDocs.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            View and manage user document submissions
          </p>
        </div>
        <Button onClick={() => { fetchUsers(currentPage, itemsPerPage); loadUserDocuments(); }} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userDocuments.filter(ud => ud.completionStatus.uploaded === ud.completionStatus.required).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with all required documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial Submissions</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userDocuments.filter(ud => ud.completionStatus.uploaded > 0 && ud.completionStatus.uploaded < ud.completionStatus.required).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with some documents uploaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Documents</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userDocuments.filter(ud => ud.completionStatus.uploaded === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with no documents uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Documents ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Click "View Documents" to see detailed document information for each user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => fetchUsers(currentPage, itemsPerPage)} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Document Status</TableHead>
                    <TableHead>Total Documents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((userDocs) => (
                    <TableRow key={userDocs.user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{userDocs.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">ID: {userDocs.user.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{userDocs.user.email}</p>
                          <p className="text-sm text-muted-foreground">{userDocs.user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDocumentStatusBadge(userDocs)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {userDocs.documents.length} uploaded
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewUserDocuments(userDocs)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Documents
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents Dialog */}
      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Documents for {selectedUserDocs?.user.fullName}
            </DialogTitle>
            <DialogDescription>
              {selectedUserDocs?.user.email} • Document completion: {selectedUserDocs?.completionStatus.uploaded}/{selectedUserDocs?.completionStatus.required} required
            </DialogDescription>
          </DialogHeader>

          {selectedUserDocs && (
            <div className="space-y-4">
              {/* Document Categories */}
              {['consent_form', 'medical_history', 'id_proof', 'passport_copy'].map((category) => {
                const categoryDocs = selectedUserDocs.documents.filter(doc => doc.category === category);
                const isRequired = ['consent_form', 'medical_history', 'id_proof'].includes(category);

                return (
                  <Card key={category}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryLabel(category)}
                          {isRequired && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </CardTitle>
                        <Badge variant={categoryDocs.length > 0 ? "default" : "secondary"}>
                          {categoryDocs.length} uploaded
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {categoryDocs.length > 0 ? (
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => alert('Download functionality - In production, this would download the file')}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No documents uploaded in this category</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDocumentsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocumentsPage;
