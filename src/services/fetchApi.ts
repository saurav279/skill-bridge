const DEFAULT_API_URL = "http://localhost:3001";

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(
    /\/+$/,
    ""
  );
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

interface RequestOptions<TBody = unknown> {
  body?: TBody;
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || DEFAULT_API_URL).replace(/\/+$/, "");
  }

  private buildUrl(
    endpoint: string,
    params?: RequestOptions["params"]
  ): string {
    const cleanEndpoint = endpoint.replace(/^\/+/, "");

    const url = `${this.baseUrl}/${cleanEndpoint}`;

    if (!params) {
      return url;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();

    return queryString ? `${url}?${queryString}` : url;
  }

  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    try {
      const { body, params, headers, signal, cache, next } = options;

      const response = await fetch(this.buildUrl(endpoint, params), {
        method,
        signal,
        cache,
        next,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        ...(body !== undefined && method !== "GET"
          ? {
              body: JSON.stringify(body),
            }
          : {}),
      });

      const responseData = await this.parseResponse(response);

      if (!response.ok) {
        return {
          success: false,
          data: null,
          error: this.getErrorMessage(responseData, response.status),
        };
      }

      return {
        success: true,
        data: responseData as TResponse,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error:
          error instanceof Error ? error.message : "Something went wrong.",
      };
    }
  }

  private async parseResponse(response: Response): Promise<unknown> {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }

  private getErrorMessage(data: unknown, status: number): string {
    if (typeof data === "object" && data !== null) {
      const response = data as Record<string, unknown>;

      if (typeof response.message === "string") {
        return response.message;
      }

      if (typeof response.error === "string") {
        return response.error;
      }
    }

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    return `Request failed with status ${status}.`;
  }

  async get<TResponse>(
    endpoint: string,
    options?: Omit<RequestOptions, "body">
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("GET", endpoint, options);
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody>, "body">
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>("POST", endpoint, {
      ...options,
      body,
    });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody>, "body">
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>("PUT", endpoint, {
      ...options,
      body,
    });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody>, "body">
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>("PATCH", endpoint, {
      ...options,
      body,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    options?: Omit<RequestOptions, "body">
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("DELETE", endpoint, options);
  }
}

export const api = new ApiClient(getApiBaseUrl());
