import { CreatePayTagRequest, PayTag, ApiResponse, PaginatedResponse } from "@/types/api";

const API_BASE_URL = '/api/tags';

export async function getTags(params?: {
  type?: 'p2p' | 'merchant';
  status?: string;
  limit?: number;
  skip?: number;
}): Promise<ApiResponse<PaginatedResponse<PayTag>>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    
    const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch tags');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch tags',
      },
    };
  }
}

export async function createTag(data: CreatePayTagRequest): Promise<ApiResponse<PayTag>> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create tag');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating tag:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create tag',
      },
    };
  }
}

export async function getTagById(tagId: string): Promise<ApiResponse<PayTag>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${tagId}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch tag');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tag:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch tag',
      },
    };
  }
}
