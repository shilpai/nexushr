/**
 * Employee Request Validation
 */
export const validateEmployeePayload = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.push({ field: 'name', message: 'Employee name is required.' });
    }
  }

  if (!isUpdate || data.email !== undefined) {
    if (!data.email || typeof data.email !== 'string' || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push({ field: 'email', message: 'A valid email address is required.' });
    }
  }

  if (!isUpdate || data.role !== undefined) {
    if (!data.role || typeof data.role !== 'string' || !data.role.trim()) {
      errors.push({ field: 'role', message: 'Job title / role is required.' });
    }
  }

  if (!isUpdate || data.salary !== undefined) {
    const salary = Number(data.salary);
    if (isNaN(salary) || salary < 0) {
      errors.push({ field: 'salary', message: 'Salary must be a positive number.' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
