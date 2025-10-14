import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importar componentes existentes
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberForm from './pages/MemberForm';
import Receipts from './pages/Remeses';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen w-full">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="members/new" element={<MemberForm />} />
              <Route path="members/:id/edit" element={<MemberForm />} />
              <Route path="receipts" element={<Receipts />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </div>
  );
}

export default App;
