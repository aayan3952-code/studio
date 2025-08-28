
'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAgreement, getAllAgreements, updateAgreementStatus } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, LogOut, Shield, Users, FileText, BarChart2, CheckCircle, Trash2, Search as SearchIcon, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Agreement = {
  id: string;
  carrierFullName: string;
  mcNumber: string;
  email: string;
  status: string;
  submittedAt: string;
  [key: string]: any;
};

export default function AdminDashboard() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Agreement; direction: 'ascending' | 'descending' } | null>({ key: 'submittedAt', direction: 'descending' });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('firebaseIdToken='));
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchAgreements = async () => {
      setIsLoading(true);
      const result = await getAllAgreements();
      if (result.success && result.data) {
        setAgreements(result.data as Agreement[]);
      } else {
        setError('Failed to load agreements.');
      }
      setIsLoading(false);
    };

    fetchAgreements();
  }, [router]);

  const handleSignOut = () => {
    document.cookie = 'firebaseIdToken=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const handleStatusChange = async (id: string, status: string) => {
    const originalAgreements = [...agreements];
    setAgreements(agreements.map(a => a.id === id ? { ...a, status } : a));

    const result = await updateAgreementStatus(id, status);
    if (!result.success) {
      setAgreements(originalAgreements);
      toast({
        title: 'Update Failed',
        description: 'Could not update the agreement status. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status Updated',
        description: `Agreement status changed to ${status}.`,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const originalAgreements = [...agreements];
    setAgreements(agreements.filter(a => a.id !== id));

    const result = await deleteAgreement(id);
    if (!result.success) {
        setAgreements(originalAgreements);
        toast({
            title: 'Delete Failed',
            description: 'Could not delete the agreement. Please try again.',
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Agreement Deleted',
            description: 'The agreement has been successfully deleted.',
        });
    }
  };

  const filteredAndSortedAgreements = useMemo(() => {
    let sortableItems = [...agreements];
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.carrierFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [agreements, searchTerm, sortConfig]);

  const requestSort = (key: keyof Agreement) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return 'default';
      case 'in progress': return 'secondary';
      case 'completed': return 'success';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const stats = {
    total: agreements.length,
    submitted: agreements.filter(a => a.status === 'Submitted').length,
    inProgress: agreements.filter(a => a.status === 'In Progress').length,
    completed: agreements.filter(a => a.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-headline font-bold text-foreground">
                        Admin Dashboard
                    </h1>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="h-5 w-5"/>
                    <span className="sr-only">Sign Out</span>
                </Button>
            </div>
        </div>
      </header>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.submitted}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.completed}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Submissions</CardTitle>
                    <CardDescription>View, manage, search, and sort all service agreements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <div className="relative w-full max-w-sm">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or MC#"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="w-full pl-10"
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <p>Loading agreements...</p>
                    ) : error ? (
                         <p className="text-destructive">{error}</p>
                    ) : (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button variant="ghost" onClick={() => requestSort('carrierFullName')}>
                                    Carrier Name <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => requestSort('mcNumber')}>
                                    MC Number <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => requestSort('submittedAt')}>
                                    Submitted At <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => requestSort('status')}>
                                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedAgreements.map((agreement) => (
                                <TableRow key={agreement.id}>
                                    <TableCell className="font-medium">{agreement.carrierFullName}</TableCell>
                                    <TableCell>{agreement.mcNumber}</TableCell>
                                    <TableCell>{new Date(agreement.submittedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(agreement.status) as any}>{agreement.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(agreement.id, 'Submitted')}>Submitted</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(agreement.id, 'In Progress')}>In Progress</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(agreement.id, 'Completed')}>Completed</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(agreement.id, 'Rejected')}>Rejected</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the
                                                    agreement for {agreement.carrierFullName}.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive hover:bg-destructive/90"
                                                    onClick={() => handleDelete(agreement.id)}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
