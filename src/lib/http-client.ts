import { toast } from '@/hooks/use-toast';

const BASE_URL = 'http://localhost:8090';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class HttpClient {
  private getAuthHeader(): HeadersInit {
    const token = sessionStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 403) {
        // Token expirado o inválido
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      throw new Error(data.error?.message || 'Error en la petición');
    }
    
    return data;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(endpoint, config.params), {
        method: 'GET',
        headers: this.getAuthHeader(),
        ...config,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error en la petición",
        variant: "destructive",
      });
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error en la petición",
        variant: "destructive",
      });
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PUT',
        headers: this.getAuthHeader(),
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error en la petición",
        variant: "destructive",
      });
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    try {
      const isFormData = data instanceof FormData;
      
      const headers = isFormData 
        ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        : this.getAuthHeader();
      
      const body = isFormData ? data : (data ? JSON.stringify(data) : undefined);
      
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PATCH',
        headers,
        body,
        ...config,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error en la petición",
        variant: "destructive",
      });
      throw error;
    }
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'DELETE',
        headers: this.getAuthHeader(),
        ...config,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error en la petición",
        variant: "destructive",
      });
      throw error;
    }
  }
}

export const httpClient = new HttpClient(); 