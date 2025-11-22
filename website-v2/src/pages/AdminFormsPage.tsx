import React, { useState, useEffect } from 'react';
import { useAdmin, AdminForm } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
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
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const AdminFormsPage: React.FC = () => {
  const { forms, loading, error, fetchForms, updateFormStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedForm, setSelectedForm] = useState<AdminForm | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'review'>('review');
  const [reviewNotes, setReviewNotes] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    const filters: any = {};

    if (statusFilter !== 'all') {
      filters.status = statusFilter;
    }

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    fetchForms(currentPage, itemsPerPage, filters);
  }, [fetchForms, currentPage, statusFilter, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    const filters: any = {};

    if (statusFilter !== 'all') {
      filters.status = statusFilter;
    }

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    fetchForms(1, itemsPerPage, filters);
  };

  const handleReviewAction = async () => {
    if (!selectedForm) return;

    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      review: 'under_review'
    };

    const success = await updateFormStatus(selectedForm._id, statusMap[reviewAction], reviewNotes);
    if (success) {
      setShowReviewDialog(false);
      setSelectedForm(null);
      setReviewNotes('');
      // Forms will be refreshed automatically by updateFormStatus
    }
  };

  const openReviewDialog = (form: AdminForm, action: 'approve' | 'reject' | 'review') => {
    setSelectedForm(form);
    setReviewAction(action);
    setReviewNotes('');
    setShowReviewDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      draft: { label: 'Draft', variant: 'secondary' as const, icon: <Clock className="h-3 w-3" /> },
      submitted: { label: 'Submitted', variant: 'default' as const, icon: <FileText className="h-3 w-3" /> },
      under_review: { label: 'Under Review', variant: 'outline' as const, icon: <AlertCircle className="h-3 w-3" /> },
      approved: { label: 'Approved', variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: <XCircle className="h-3 w-3" /> },
    };

    const config = configs[status as keyof typeof configs] || configs.draft;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const filteredForms = forms.filter(form =>
    form.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  const viewFormDetails = (form: AdminForm) => {
    setSelectedForm(form);
    setShowViewDialog(true);
  };

  const getActionButtons = (form: AdminForm) => {
    const buttons = [];

    // Always add View option
    buttons.push(
      <DropdownMenuItem
        key="view"
        onClick={() => viewFormDetails(form)}
      >
        <FileText className="h-4 w-4 mr-2" />
        View Details
      </DropdownMenuItem>
    );

    if (form.status === 'submitted' || form.status === 'under_review') {
      buttons.push(
        <DropdownMenuItem
          key="approve"
          onClick={() => openReviewDialog(form, 'approve')}
          className="text-green-600"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </DropdownMenuItem>
      );
      buttons.push(
        <DropdownMenuItem
          key="reject"
          onClick={() => openReviewDialog(form, 'reject')}
          className="text-red-600"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </DropdownMenuItem>
      );
    }

    if (form.status === 'submitted') {
      buttons.push(
        <DropdownMenuItem
          key="review"
          onClick={() => openReviewDialog(form, 'review')}
          className="text-blue-600"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Mark Under Review
        </DropdownMenuItem>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Management</h1>
          <p className="text-muted-foreground">
            Review and manage treatment forms
          </p>
        </div>
        <Button onClick={() => fetchForms(currentPage, itemsPerPage)} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Form status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Forms ({filteredForms.length})</CardTitle>
          <CardDescription>
            Click on actions to review, approve, or reject forms
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
              <Button onClick={() => fetchForms(currentPage, itemsPerPage)} className="mt-4">
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
                    <TableHead>Form Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => (
                    <TableRow key={form._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{form.user.fullName}</p>
                          <p className="text-sm text-muted-foreground">ID: {form.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{form.user.email}</p>
                          <p className="text-sm text-muted-foreground">{form.user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(form.status)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : 'Not submitted'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(form.lastModifiedAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {getActionButtons(form)}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredForms.length)} of {filteredForms.length} forms
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

      {/* View Form Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Treatment Form Details</DialogTitle>
            <DialogDescription>
              {selectedForm && (
                <>Complete form submission from {selectedForm.user.fullName}</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedForm && (
            <div className="space-y-4">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Full Name:</span>
                      <p className="mt-1">{selectedForm.user.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Email:</span>
                      <p className="mt-1">{selectedForm.user.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Phone:</span>
                      <p className="mt-1">{selectedForm.user.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Country:</span>
                      <p className="mt-1">{selectedForm.user.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Date of Birth:</span>
                      <p className="mt-1">{selectedForm.dateOfBirth || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Gender:</span>
                      <p className="mt-1">{selectedForm.gender || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purpose of Visit */}
              {selectedForm.purposeOfVisit && selectedForm.purposeOfVisit.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Purpose of Visit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedForm.purposeOfVisit.map((purpose, idx) => (
                        <Badge key={idx} variant="secondary">{purpose}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Form Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submission Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedForm.status)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Submitted At:</span>
                      <p className="mt-1">
                        {selectedForm.submittedAt 
                          ? new Date(selectedForm.submittedAt).toLocaleString()
                          : 'Not submitted'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Last Modified:</span>
                      <p className="mt-1">
                        {new Date(selectedForm.lastModifiedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Created At:</span>
                      <p className="mt-1">
                        {new Date(selectedForm.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' && 'Approve Form'}
              {reviewAction === 'reject' && 'Reject Form'}
              {reviewAction === 'review' && 'Mark Under Review'}
            </DialogTitle>
            <DialogDescription>
              {selectedForm && (
                <>Review form for {selectedForm.user.fullName} ({selectedForm.user.email})</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedForm && (
            <div className="space-y-4">
              {/* Form Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Form Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">User:</span> {selectedForm.user.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedForm.user.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedForm.user.phone}
                    </div>
                    <div>
                      <span className="font-medium">Country:</span> {selectedForm.user.country}
                    </div>
                    <div>
                      <span className="font-medium">Current Status:</span> {getStatusBadge(selectedForm.status)}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {selectedForm.submittedAt ? new Date(selectedForm.submittedAt).toLocaleString() : 'Not submitted'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Review Notes (Optional)
                </label>
                <Textarea
                  placeholder="Add any notes about this decision..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReviewAction}
              className={
                reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                reviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }
            >
              {reviewAction === 'approve' && 'Approve Form'}
              {reviewAction === 'reject' && 'Reject Form'}
              {reviewAction === 'review' && 'Mark Under Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFormsPage;
