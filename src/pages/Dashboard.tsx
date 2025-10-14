import { useQuery } from '@tanstack/react-query';
import { User, Users, AlertCircle, Clock } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  recentMembers: Member[];
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async (): Promise<DashboardStats> => {
      // TODO: Replace with actual API call
      return {
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        recentMembers: [],
      };
    },
  });

  // Si no hay datos, mostrar un estado de carga o vacío
  if (isLoading || !stats) {
    return <div className="p-6">Carregant dades...</div>;
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Panell de control</h1>
      
      {/* Stats */}
      <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total de socis',
            value: stats.totalMembers,
            icon: <Users className="h-6 w-6 text-white" />,
            bgColor: 'bg-indigo-500',
          },
          {
            title: 'Socis actius',
            value: stats.activeMembers,
            icon: <User className="h-6 w-6 text-white" />,
            bgColor: 'bg-green-500',
          },
          {
            title: 'Pendents',
            value: stats.pendingMembers,
            icon: <Clock className="h-6 w-6 text-white" />,
            bgColor: 'bg-yellow-500',
          },
          {
            title: 'Accions pendents',
            value: '0',
            icon: <AlertCircle className="h-6 w-6 text-white" />,
            bgColor: 'bg-blue-500',
          },
        ].map((stat, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 w-full">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {stat.title}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-lg font-medium text-gray-900">Últims socis afegits</h2>
            <p className="mt-1 text-sm text-gray-600">
              Llista dels últims socis donats d'alta a l'aplicació
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Veure tots els socis
            </button>
          </div>
        </div>
        
        <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {stats.recentMembers.length > 0 ? (
              stats.recentMembers.map((member) => (
                <li key={member.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">{member.name}</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {member.status === 'active' ? 'Actiu' : 'Inactiu'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {member.email}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Donat d'alta el {new Date(member.joinDate).toLocaleDateString('ca-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-gray-500">
                No hi ha socis recents
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
