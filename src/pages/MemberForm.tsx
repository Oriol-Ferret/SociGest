import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';

// Definir el tipo de datos del formulario
type FormValues = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  dni?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  notes?: string;
};

const memberSchema = yup.object({
  name: yup.string().required('El nom és obligatori'),
  email: yup.string().email('Introdueix un email vàlid').required('El correu electrònic és obligatori'),
  phone: yup.string(),
  address: yup.string(),
  city: yup.string(),
  postalCode: yup.string(),
  dni: yup.string(),
  status: yup.mixed().oneOf(['active', 'inactive', 'pending'] as const).required('L\'estat és obligatori'),
  joinDate: yup.string().required('La data d\'alta és obligatòria'),
  notes: yup.string(),
}).required();

// Usar el tipo explícito en lugar de InferType
type MemberFormData = FormValues;

export default function MemberForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // In a real app, this would fetch the member data if editing
  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: async (): Promise<MemberFormData> => {
      if (!isEditing) {
        return {
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          dni: '',
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          notes: '',
        };
      }
      
      // Mock data for now - in a real app, this would be an API call
      return {
        name: 'Nom del soci',
        email: 'soci@example.com',
        phone: '123456789',
        address: 'Carrer Exemple, 123',
        city: 'Barcelona',
        postalCode: '08001',
        dni: '12345678A',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        notes: '',
      };
    },
    enabled: isEditing,
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<MemberFormData>({
    resolver: yupResolver(memberSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      dni: '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  // Reset form when member data is loaded
  useEffect(() => {
    if (member) {
      reset(member);
    }
  }, [member, reset]);

  const mutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      // TODO: Replace with actual API call
      console.log('Saving member:', data);
      return { id: id || Math.random().toString(36).substr(2, 9) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(isEditing ? 'Soci actualitzat correctament' : 'Soci creat correctament');
      navigate('/members');
    },
    onError: () => {
      toast.error('Error al desar el soci');
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading && isEditing) {
    return <div>Carregant dades del soci...</div>;
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {isEditing ? 'Editar soci' : 'Nou soci'}
          </h2>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Dades personals</h3>
              <p className="mt-1 text-sm text-gray-500">Informació bàsica del soci</p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black ${
                      errors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black ${
                      errors.email ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telèfon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                    DNI/NIE
                  </label>
                  <input
                    type="text"
                    id="dni"
                    {...register('dni')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Adreça</h3>
              <p className="mt-1 text-sm text-gray-500">Adreça postal del soci</p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adreça
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register('address')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciutat
                  </label>
                  <input
                    type="text"
                    id="city"
                    {...register('city')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Codi postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    {...register('postalCode')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Estat i informació addicional</h3>
              <p className="mt-1 text-sm text-gray-500">Estat del soci i notes addicionals</p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Estat *
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="active">Actiu</option>
                    <option value="inactive">Inactiu</option>
                    <option value="pending">Pendent</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                    Data d'alta *
                  </label>
                  <input
                    type="date"
                    id="joinDate"
                    {...register('joinDate')}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      rows={4}
                      {...register('notes')}
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Afegeix qualsevol informació addicional sobre el soci.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 bg-white px-4 py-3 text-right sm:px-6 rounded-b-lg shadow">
          <button
            type="button"
            onClick={() => navigate('/members')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel·lar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Desant...' : 'Desar soci'}
          </button>
        </div>
      </form>
    </div>
  );
}
