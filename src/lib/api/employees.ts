import { api } from './client'
import { Employee, NewEmployee } from '@/lib/db/schema'
import { PaginatedResponse } from './client'

// Employee API types
export interface CreateEmployeeRequest extends Omit<NewEmployee, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateEmployeeRequest extends Partial<Omit<NewEmployee, 'id' | 'created_at' | 'updated_at'>> {}

export interface GetEmployeesParams {
  page?: number
  limit?: number
}

export interface GetEmployeesResponse extends PaginatedResponse<Employee> {
  employees: Employee[]
  total: number
}

export interface DepartmentStats {
  department: string
  count: number
}

// Employees API service
export const employeesApi = {
  // Get all employees with pagination
  getEmployees: async (params: GetEmployeesParams = {}): Promise<GetEmployeesResponse> => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    
    const queryString = searchParams.toString()
    const url = `/employees${queryString ? `?${queryString}` : ''}`
    
    return api.get<GetEmployeesResponse>(url)
  },

  // Get employee by ID
  getEmployee: async (id: number): Promise<Employee> => {
    return api.get<Employee>(`/employees/${id}`)
  },

  // Get current employee's profile
  getEmployeeProfile: async (): Promise<Employee> => {
    return api.get<Employee>('/employees/profile')
  },

  // Update current employee's profile image
  updateEmployeeProfile: async (image_url: string): Promise<Employee> => {
    return api.patch<Employee>('/employees/profile', { image_url })
  },

  // Create new employee
  createEmployee: async (employee: CreateEmployeeRequest): Promise<Employee> => {
    return api.post<Employee>('/employees', employee)
  },

  // Update employee
  updateEmployee: async (id: number, employee: UpdateEmployeeRequest): Promise<Employee> => {
    return api.put<Employee>(`/employees/${id}`, employee)
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/employees/${id}`)
  },

  // Get employees by department
  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    return api.get<Employee[]>(`/employees/department/${department}`)
  },

  // Get department statistics
  getDepartmentStats: async (): Promise<DepartmentStats[]> => {
    return api.get<DepartmentStats[]>('/employees/stats/departments')
  },
} 