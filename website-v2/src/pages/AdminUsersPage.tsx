import React, { useState, useEffect } from 'react';
import { useAdmin, AdminUser } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
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
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  MoreHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const AdminUsersPage: React.FC = () => {
  const { users, loading, error, fetchUsers, updateUserRole } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  const itemsPerPage = 10;

  useEffect(() => {
    const filters: any = {};

    if (verificationFilter !== 'all') {
      filters.verified = verificationFilter === 'verified';
    }

    if (formFilter !== 'all') {
      filters.hasForm = formFilter === 'with_form';
    }

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    fetchUsers(currentPage, itemsPerPage, filters);
  }, [fetchUsers, currentPage, verificationFilter, formFilter, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    const filters: any = {};

    if (verificationFilter !== 'all') {
      filters.verified = verificationFilter === 'verified';
    }

    if (formFilter !== 'all') {
      filters.hasForm = formFilter === 'with_form';
    }

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    fetchUsers(1, itemsPerPage, filters);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    const success = await updateUserRole(selectedUser.id, newRole);
    if (success) {
      setShowRoleDialog(false);
      setSelectedUser(null);
      // Users will be refreshed automatically by updateUserRole
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    const configs = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      submitted: { label: 'Submitted', variant: 'default' as const },
      under_review: { label: 'Under Review', variant: 'outline' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
    };

    const config = configs[user.beautyFormStatus];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getVerificationBadge = (user: AdminUser) => {
    return user.isVerified ? (
      <Badge variant="default" className="bg-green-500">
        <UserCheck className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary">
        <UserX className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  const getRoleBadge = (user: AdminUser) => {
    return user.role === 'admin' ? (
      <Badge variant="default" className="bg-purple-500">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="outline">
        <Shield className="h-3 w-3 mr-1" />
        User
      </Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            View and manage all registered users
          </p>
        </div>
        <Button onClick={() => fetchUsers(currentPage, itemsPerPage)} disabled={loading}>
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Verification status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formFilter} onValueChange={setFormFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Form status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                <SelectItem value="with_form">Has Form</SelectItem>
                <SelectItem value="no_form">No Form</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Click on a user row to view details and manage their account
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
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getVerificationBadge(user)}
                          {user.beautyFormSubmitted && getStatusBadge(user)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowViewDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role);
                                setShowRoleDialog(true);
                              }}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
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

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>Complete information for {selectedUser.fullName}</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Full Name:</span>
                      <p className="mt-1">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Email:</span>
                      <p className="mt-1">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Age:</span>
                      <p className="mt-1">{selectedUser.age}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Phone:</span>
                      <p className="mt-1">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Country:</span>
                      <p className="mt-1">{selectedUser.country}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">User ID:</span>
                      <p className="mt-1 font-mono text-xs">{selectedUser.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Role:</span>
                      <div className="mt-1">
                        <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                          {selectedUser.role === 'admin' ? (
                            <><ShieldCheck className="h-3 w-3 mr-1" /> Admin</>
                          ) : (
                            <><Shield className="h-3 w-3 mr-1" /> User</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Verification:</span>
                      <div className="mt-1">
                        <Badge variant={selectedUser.isVerified ? 'default' : 'secondary'}>
                          {selectedUser.isVerified ? (
                            <><UserCheck className="h-3 w-3 mr-1" /> Verified</>
                          ) : (
                            <><UserX className="h-3 w-3 mr-1" /> Not Verified</>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Profile Completed:</span>
                      <p className="mt-1">{selectedUser.profileCompleted ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Password Set:</span>
                      <p className="mt-1">{selectedUser.passwordSet ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">First Login:</span>
                      <p className="mt-1">{selectedUser.isFirstLogin ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Created At:</span>
                      <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Treatment Form Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Form Submitted:</span>
                      <p className="mt-1">{selectedUser.beautyFormSubmitted ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Form Status:</span>
                      <div className="mt-1">
                        <Badge variant={
                          selectedUser.beautyFormStatus === 'approved' ? 'default' :
                          selectedUser.beautyFormStatus === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {selectedUser.beautyFormStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
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

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.fullName}. This will affect their access permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(value: 'user' | 'admin') => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
