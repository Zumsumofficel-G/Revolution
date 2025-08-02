import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Separator } from "./components/ui/separator";
import { Users, Server, Settings, FileText, Plus, Eye, Trash2, Edit } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [user, setUser] = useState(null);

  const login = (token) => {
    setToken(token);
    localStorage.setItem('admin_token', token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      axios.get(`${API}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setUser(response.data);
      }).catch(() => {
        logout();
      });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Landing Page
const LandingPage = () => {
  const [serverStats, setServerStats] = useState({ players: 0, max_players: 64, hostname: "Revolution Roleplay" });
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch server stats
    const fetchServerStats = async () => {
      try {
        const response = await axios.get(`${API}/server-stats`);
        setServerStats(response.data);
      } catch (error) {
        console.error("Failed to fetch server stats:", error);
      }
    };

    // Fetch public applications
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API}/applications`);
        setApplications(response.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchServerStats();
    fetchApplications();

    // Update server stats every 30 seconds
    const interval = setInterval(fetchServerStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_e66817cd-11b4-4986-8bb5-ab2fe06c620d/artifacts/ag8fwiri_Revolution.png" 
                alt="Revolution RP" 
                className="h-12 w-12"
              />
              <h1 className="text-2xl font-bold text-white">Revolution Roleplay</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <Server className="h-5 w-5" />
                <span className="font-semibold">{serverStats.players}/{serverStats.max_players}</span>
              </div>
              <Link to="/admin">
                <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{backgroundImage: "url('https://customer-assets.emergentagent.com/job_e66817cd-11b4-4986-8bb5-ab2fe06c620d/artifacts/6wugvqcm_Foto_Revolution.jpg')"}}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Velkommen til Revolution Roleplay
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Oplev det bedste roleplay på FiveM med vores dedikerede community og realistiske gameplay.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              <a href="#applications">Ansøg Nu</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
              Discord Server
            </Button>
          </div>
        </div>
      </section>

      {/* Server Stats */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-purple-500/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Aktive Spillere</CardTitle>
                  <Users className="h-8 w-8 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{serverStats.players}/{serverStats.max_players}</div>
                <p className="text-gray-400 text-sm">Spillere online nu</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-purple-500/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Server Status</CardTitle>
                  <Server className="h-8 w-8 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">ONLINE</div>
                <p className="text-gray-400 text-sm">{serverStats.hostname}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-purple-500/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Åbne Ansøgninger</CardTitle>
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{applications.length}</div>
                <p className="text-gray-400 text-sm">Aktive stillings ansøgninger</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Ansøg til vores team</h3>
            <p className="text-gray-300 text-lg">Vi søger altid engagerede spillere til vores team</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="bg-white/5 border-purple-500/20 text-white hover:bg-white/10 transition-all">
                <CardHeader>
                  <CardTitle className="text-xl">{app.title}</CardTitle>
                  <CardDescription className="text-gray-300">{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {app.position}
                    </Badge>
                    <p className="text-gray-400 text-sm">{app.fields.length} spørgsmål</p>
                    <Link to={`/apply/${app.id}`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Ansøg Nu
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_e66817cd-11b4-4986-8bb5-ab2fe06c620d/artifacts/ag8fwiri_Revolution.png" 
              alt="Revolution RP" 
              className="h-8 w-8"
            />
            <span className="text-white font-semibold">Revolution Roleplay</span>
          </div>
          <p className="text-gray-400">&copy; 2025 Revolution Roleplay. Alle rettigheder forbeholdes.</p>
        </div>
      </footer>
    </div>
  );
};

// Application Form Page
const ApplicationForm = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [applicantName, setApplicantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`${API}/applications/${formId}`);
        setForm(response.data);
        // Initialize responses
        const initialResponses = {};
        response.data.fields.forEach(field => {
          initialResponses[field.id] = field.field_type === 'checkbox' ? [] : '';
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error("Failed to fetch form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleFieldChange = (fieldId, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      alert("Indtast venligst dit navn");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/applications/submit`, {
        form_id: formId,
        applicant_name: applicantName,
        responses
      });
      alert("Ansøgning sendt successfully!");
      navigate('/');
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Fejl ved indsendelse af ansøgning");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={responses[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={responses[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            rows={4}
          />
        );
      case 'select':
        return (
          <Select onValueChange={(value) => handleFieldChange(field.id, value)} required={field.required}>
            <SelectTrigger>
              <SelectValue placeholder="Vælg en mulighed" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Indlæser...</div>;
  if (!form) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Ansøgning ikke fundet</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white/10 border-purple-500/20 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{form.title}</CardTitle>
            <CardDescription className="text-gray-300 text-center text-lg">
              {form.description}
            </CardDescription>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 w-fit mx-auto">
              {form.position}
            </Badge>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="applicant_name" className="text-white">Dit navn *</Label>
                <Input
                  id="applicant_name"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  className="bg-white/5 border-purple-500/30 text-white"
                  placeholder="Indtast dit fulde navn"
                />
              </div>

              <Separator className="bg-purple-500/20" />

              {form.fields.map((field) => (
                <div key={field.id}>
                  <Label className="text-white">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </Label>
                  <div className="mt-2">
                    {renderField(field)}
                  </div>
                </div>
              ))}

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-800"
                >
                  Annuller
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {submitting ? 'Sender...' : 'Send Ansøgning'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Admin Login
const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      login(response.data.access_token);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Forkerte loginoplysninger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Card className="w-full max-w-md bg-white/10 border-purple-500/20">
        <CardHeader className="text-center">
          <img 
            src="https://customer-assets.emergentagent.com/job_e66817cd-11b4-4986-8bb5-ab2fe06c620d/artifacts/ag8fwiri_Revolution.png" 
            alt="Revolution RP" 
            className="h-16 w-16 mx-auto mb-4"
          />
          <CardTitle className="text-2xl text-white">Admin Panel</CardTitle>
          <CardDescription className="text-gray-300">Log ind for at administrere serveren</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white">Brugernavn</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="bg-white/5 border-purple-500/30 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Adgangskode</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="bg-white/5 border-purple-500/30 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              disabled={loading}
            >
              {loading ? 'Logger ind...' : 'Log ind'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [serverStats, setServerStats] = useState({});

  useEffect(() => {
    fetchApplications();
    fetchSubmissions();
    fetchServerStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API}/admin/application-forms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API}/admin/submissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const fetchServerStats = async () => {
    try {
      const response = await axios.get(`${API}/server-stats`);
      setServerStats(response.data);
    } catch (error) {
      console.error('Failed to fetch server stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_e66817cd-11b4-4986-8bb5-ab2fe06c620d/artifacts/ag8fwiri_Revolution.png" 
              alt="Revolution RP" 
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Velkommen, {user?.username}</span>
            <Button onClick={logout} variant="outline" className="border-red-500 text-red-300 hover:bg-red-500/20">
              Log ud
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white/10 border-purple-500/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">Oversigt</TabsTrigger>
            <TabsTrigger value="applications" className="text-white data-[state=active]:bg-purple-600">Ansøgninger</TabsTrigger>
            <TabsTrigger value="submissions" className="text-white data-[state=active]:bg-purple-600">Indsendte Ansøgninger</TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-purple-600">Indstillinger</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/10 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Spillere Online
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{serverStats.players || 0}/{serverStats.max_players || 64}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Aktive Ansøgninger
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{applications.filter(a => a.is_active).length}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-purple-500/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Nye Ansøgninger
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{submissions.filter(s => s.status === 'pending').length}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle>Seneste Ansøgninger</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map(submission => (
                    <div key={submission.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold">{submission.applicant_name}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(submission.submitted_at).toLocaleDateString('da-DK')}
                        </p>
                      </div>
                      <Badge variant={submission.status === 'pending' ? 'default' : submission.status === 'approved' ? 'secondary' : 'destructive'}>
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationManager applications={applications} onUpdate={fetchApplications} />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionManager submissions={submissions} onUpdate={fetchSubmissions} />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Application Manager Component
const ApplicationManager = ({ applications, onUpdate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: '',
    fields: [],
    webhook_url: ''
  });

  const fieldTypes = [
    { value: 'text', label: 'Tekst' },
    { value: 'textarea', label: 'Tekstboks' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio knapper' },
    { value: 'checkbox', label: 'Checkboxe' }
  ];

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      field_type: 'text',
      options: [],
      required: false,
      placeholder: ''
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingApp ? 
        `${API}/admin/application-forms/${editingApp.id}` : 
        `${API}/admin/application-forms`;
      const method = editingApp ? 'PUT' : 'POST';

      await axios({
        method,
        url,
        data: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });

      onUpdate();
      setIsCreating(false);
      setEditingApp(null);
      setFormData({ title: '', description: '', position: '', fields: [], webhook_url: '' });
    } catch (error) {
      console.error('Failed to save application:', error);
      alert('Fejl ved gem af ansøgning');
    }
  };

  const deleteApplication = async (id) => {
    if (confirm('Er du sikker på at du vil slette denne ansøgning?')) {
      try {
        await axios.delete(`${API}/admin/application-forms/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
        onUpdate();
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    }
  };

  const startEdit = (app) => {
    setEditingApp(app);
    setFormData(app);
    setIsCreating(true);
  };

  if (isCreating) {
    return (
      <Card className="bg-white/10 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle>{editingApp ? 'Rediger Ansøgning' : 'Opret Ny Ansøgning'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Titel</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="bg-white/5 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  required
                  className="bg-white/5 border-purple-500/30 text-white"
                  placeholder="f.eks. Staff, Moderator, Developer"
                />
              </div>
            </div>

            <div>
              <Label>Beskrivelse</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                className="bg-white/5 border-purple-500/30 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label>Discord Webhook URL</Label>
              <Input
                value={formData.webhook_url}
                onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                className="bg-white/5 border-purple-500/30 text-white"
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg">Formular Felter</Label>
                <Button type="button" onClick={addField} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tilføj Felt
                </Button>
              </div>

              <div className="space-y-4">
                {formData.fields.map((field) => (
                  <Card key={field.id} className="bg-white/5 border-purple-500/20 p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="bg-white/5 border-purple-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label>Felttype</Label>
                        <Select 
                          value={field.field_type} 
                          onValueChange={(value) => updateField(field.id, { field_type: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded"
                          />
                          <Label className="text-sm">Påkrævet</Label>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeField(field.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {field.field_type === 'text' && (
                      <div className="mt-4">
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          className="bg-white/5 border-purple-500/30 text-white"
                        />
                      </div>
                    )}

                    {(field.field_type === 'select' || field.field_type === 'radio') && (
                      <div className="mt-4">
                        <Label>Valgmuligheder (én per linje)</Label>
                        <Textarea
                          value={(field.options || []).join('\n')}
                          onChange={(e) => updateField(field.id, { 
                            options: e.target.value.split('\n').filter(opt => opt.trim()) 
                          })}
                          className="bg-white/5 border-purple-500/30 text-white"
                          placeholder="Mulighed 1\nMulighed 2\nMulighed 3"
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingApp(null);
                  setFormData({ title: '', description: '', position: '', fields: [], webhook_url: '' });
                }}
                className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-800"
              >
                Annuller
              </Button>
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                {editingApp ? 'Opdater' : 'Opret'} Ansøgning
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Ansøgninger</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Ny Ansøgning
        </Button>
      </div>

      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app.id} className="bg-white/10 border-purple-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{app.title}</h3>
                  <p className="text-gray-300 mb-2">{app.description}</p>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 mb-2">
                    {app.position}
                  </Badge>
                  <div className="text-sm text-gray-400">
                    {app.fields.length} felter • Oprettet {new Date(app.created_at).toLocaleDateString('da-DK')}
                  </div>
                  {app.webhook_url && (
                    <div className="text-sm text-green-400 mt-1">✓ Discord webhook konfigureret</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startEdit(app)}
                    size="sm"
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteApplication(app.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Submission Manager Component
const SubmissionManager = ({ submissions, onUpdate }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const updateStatus = async (submissionId, status) => {
    try {
      await axios.put(`${API}/admin/submissions/${submissionId}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Godkendt';
      case 'rejected': return 'Afvist';
      default: return 'Afventer';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Indsendte Ansøgninger</h2>

      <Card className="bg-white/10 border-purple-500/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20">
                <TableHead className="text-white">Navn</TableHead>
                <TableHead className="text-white">Ansøgning</TableHead>
                <TableHead className="text-white">Indsendt</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} className="border-purple-500/20 text-white">
                  <TableCell className="font-medium">{submission.applicant_name}</TableCell>
                  <TableCell>Form ID: {submission.form_id.slice(0, 8)}...</TableCell>
                  <TableCell>{new Date(submission.submitted_at).toLocaleDateString('da-DK')}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(submission.status)} bg-transparent border`}>
                      {getStatusText(submission.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedSubmission(submission)}
                        size="sm"
                        variant="outline"
                        className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateStatus(submission.id, 'approved')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Godkend
                          </Button>
                          <Button
                            onClick={() => updateStatus(submission.id, 'rejected')}
                            size="sm"
                            variant="destructive"
                          >
                            Afvis
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ansøgningsdetaljer</DialogTitle>
            <DialogDescription className="text-gray-300">
              Ansøgning fra {selectedSubmission?.applicant_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedSubmission && Object.entries(selectedSubmission.responses).map(([fieldId, response]) => (
              <div key={fieldId} className="p-4 bg-white/5 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Felt ID: {fieldId}</div>
                <div className="text-white">{Array.isArray(response) ? response.join(', ') : response}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Admin Settings Component
const AdminSettings = () => {
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const createAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/admin/create-admin`, newAdmin, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      setNewAdmin({ username: '', password: '' });
      alert('Admin bruger oprettet successfully!');
    } catch (error) {
      console.error('Failed to create admin:', error);
      alert('Fejl ved oprettelse af admin bruger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Indstillinger</h2>

      <Card className="bg-white/10 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle>Opret Ny Admin</CardTitle>
          <CardDescription className="text-gray-300">
            Opret en ny administrator konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createAdmin} className="space-y-4">
            <div>
              <Label>Brugernavn</Label>
              <Input
                value={newAdmin.username}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, username: e.target.value }))}
                required
                className="bg-white/5 border-purple-500/30 text-white"
              />
            </div>
            <div>
              <Label>Adgangskode</Label>
              <Input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                required
                className="bg-white/5 border-purple-500/30 text-white"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? 'Opretter...' : 'Opret Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle>Server Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>Default Admin: admin / admin123</div>
            <div>FiveM Server API: http://45.84.198.57:30120/dynamic.json</div>
            <div>Webhook Format: Discord</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin" />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/apply/:id" element={<ApplicationForm />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;