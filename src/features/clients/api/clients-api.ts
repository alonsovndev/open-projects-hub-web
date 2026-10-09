/**
 * Client API endpoints using RTK Query
 */
import type { Client, ClientSummary } from "../../../shared/types/domain";
import { baseApi } from "../../../app/api/base-api";

interface PaginatedClientsResponse {
  items: Client[];
  total: number;
  page: number;
  perPage: number;
}

interface CreateClientRequest {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}

interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedClientsResponse, { limit?: number; offset?: number } | void>(
      {
        query: (params) => {
          const { limit = 100, offset = 0 } = params || {};
          return {
            url: "/v1/clients",
            params: { limit, offset },
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({ type: "Clients" as const, id })),
                { type: "Clients", id: "LIST" },
              ]
            : [{ type: "Clients", id: "LIST" }],
      }
    ),

    createClient: builder.mutation<Client, CreateClientRequest>({
      query: (body) => ({
        url: "/v1/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),

    updateClient: builder.mutation<Client, { id: string; data: UpdateClientRequest }>({
      query: ({ id, data }) => ({
        url: `/v1/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Clients", id },
        { type: "Clients", id: "LIST" },
      ],
    }),

    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Clients", id },
        { type: "Clients", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;

/**
 * Transform full client list to summary format for dropdowns/selectors
 */
export const selectClientSummaries = (clients: Client[]): ClientSummary[] =>
  clients.map(({ id, name, company, email }) => ({
    id,
    name,
    company,
    email,
  }));
