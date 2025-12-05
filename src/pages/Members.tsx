import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import TableSocis from '../components/TableSocis';

export default function Members() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Socis</h1>
          <p className="mt-2 text-sm text-gray-700">
            Llista de tots els socis de l'entitat
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/members/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Nou soci
          </Link>
        </div>
      </div>

      {/* Members list */}
      <div className="mt-8">
        <TableSocis />
      </div>
    </div>
  );
}
