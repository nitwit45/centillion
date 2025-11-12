import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle2, Edit } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    age: user?.age || '',
    phone: user?.phone || '',
    country: user?.country || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      age: user?.age || '',
      phone: user?.phone || '',
      country: user?.country || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="outline">
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-background">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-background">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-background">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{user.age}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-background">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-background">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{user.country}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Your profile and form completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Account Verified</span>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {user.beautyFormSubmitted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                )}
                <span>Beauty Treatment Form</span>
              </div>
              <Badge variant={user.beautyFormSubmitted ? "default" : "secondary"}>
                {user.beautyFormSubmitted ? "Complete" : "Pending"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

