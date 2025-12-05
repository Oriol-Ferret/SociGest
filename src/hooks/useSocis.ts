import { useQuery } from '@tanstack/react-query';
import type { Soci } from "../types";

const API_ENDPOINT = 'https://phoenix-solutions-e6fkgqcjhbfcb9bq.northeurope-01.azurewebsites.net/webhook/get-socis';

export function useSocis() {
    return useQuery<Soci[]>({
        queryKey: ['socis'],
        queryFn: async () => {
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                });

                if (!response.ok) {
                    return [];
                }

                const data = await response.json();

                // Handle new response structure { count: number, data: Soci[] }
                if (data && Array.isArray(data.data)) {
                    return data.data;
                }

                return [];
            } catch (error) {
                console.error('Error fetching socis:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
