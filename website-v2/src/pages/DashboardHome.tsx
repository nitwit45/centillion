import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  User,
  FileText,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusInfo = () => {
    if (!user) return null;

    const statusConfig = {
      draft: {
        title: 'Complete Your Treatment Form',
        description: 'Fill out the comprehensive beauty treatment form to begin your journey.',
        action: 'Start Form',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
      },
      submitted: {
        title: 'Form Submitted Successfully',
        description: 'Your beauty treatment form has been submitted. Our team is preparing to review your request.',
        action: 'View Form',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
      },
      under_review: {
        title: 'Under Review',
        description: 'Our medical team is carefully reviewing your treatment request. We will contact you within 2-3 business days.',
        action: 'View Status',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      },
      approved: {
        title: 'Request Approved!',
        description: 'Congratulations! Your treatment request has been approved. Our team will contact you with next steps.',
        action: 'View Details',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
      },
      rejected: {
        title: 'Request Needs Revision',
        description: 'Your request needs some modifications. Please check your email for feedback and resubmit.',
        action: 'View Feedback',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
      },
    };

    return statusConfig[user.beautyFormStatus];
  };

  const statusInfo = getStatusInfo();

  const quickLinks = [
    {
      title: 'Profile',
      description: 'View and update your personal information',
      icon: <User className="h-6 w-6" />,
      path: '/dashboard/profile',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Documents',
      description: 'Upload and manage your signed documents',
      icon: <FileText className="h-6 w-6" />,
      path: '/dashboard/documents',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Treatment Form',
      description: 'Complete your beauty treatment questionnaire',
      icon: <ClipboardList className="h-6 w-6" />,
      path: '/dashboard/treatment-form',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      badge: !user?.beautyFormSubmitted ? 'Action Required' : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your beauty enhancement journey.
        </p>
      </div>

      {/* Status Card */}
      {statusInfo && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <div className={`${statusInfo.bgColor} p-2 rounded-lg`}>
                    {user?.beautyFormStatus === 'draft' && <Clock className={`h-5 w-5 ${statusInfo.color}`} />}
                    {user?.beautyFormStatus === 'submitted' && <CheckCircle2 className={`h-5 w-5 ${statusInfo.color}`} />}
                    {user?.beautyFormStatus === 'under_review' && <AlertCircle className={`h-5 w-5 ${statusInfo.color}`} />}
                    {user?.beautyFormStatus === 'approved' && <CheckCircle2 className={`h-5 w-5 ${statusInfo.color}`} />}
                    {user?.beautyFormStatus === 'rejected' && <AlertCircle className={`h-5 w-5 ${statusInfo.color}`} />}
                  </div>
                  <span>{statusInfo.title}</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  {statusInfo.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className={statusInfo.color}>
                {user?.beautyFormStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/dashboard/treatment-form')}
              className="w-full sm:w-auto"
            >
              {statusInfo.action}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Card
              key={link.path}
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50"
              onClick={() => navigate(link.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`${link.bgColor} p-3 rounded-lg ${link.color}`}>
                    {link.icon}
                  </div>
                  {link.badge && (
                    <Badge variant="destructive" className="text-xs">
                      {link.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Our team is here to assist you every step of the way.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">📞 Phone:</span>
            <span className="font-medium">+94 123 456 789</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">✉️ Email:</span>
            <span className="font-medium">info@centilliongateway.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">🕒 Hours:</span>
            <span className="font-medium">Mon-Fri: 9:00 AM - 6:00 PM</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;

