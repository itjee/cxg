/**
 * Export utility functions for converting data to CSV and downloading
 */

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Get keys from first object if headers not provided
  const keys = headers || Object.keys(data[0]);

  // Create CSV header row
  const headerRow = keys.map((key) => `"${key}"`).join(',');

  // Create CSV data rows
  const dataRows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key];
        // Escape quotes and wrap in quotes if value contains comma or quotes
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return `"${stringValue}"`;
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export table data to CSV (removes action columns)
 */
export function exportTableToCSV(data: any[], filename: string): void {
  if (data.length === 0) {
    alert('내보낼 데이터가 없습니다.');
    return;
  }

  // Filter out common action/control columns
  const columnsToExclude = ['id', 'actions'];
  const headers = Object.keys(data[0])
    .filter((key) => !columnsToExclude.includes(key))
    .map((key) => {
      // Convert camelCase to Korean labels or Title Case
      return key.charAt(0).toUpperCase() + key.slice(1);
    });

  const filteredData = data.map((row) => {
    const newRow: any = {};
    headers.forEach((header) => {
      const key = header.charAt(0).toLowerCase() + header.slice(1);
      newRow[header] = row[key];
    });
    return newRow;
  });

  downloadCSV(filteredData, filename, headers);
}
