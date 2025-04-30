
/**
 * Helper function to parse CSV data with error handling
 */
export function parseCsvData(csvData: string): { 
  success: boolean; 
  data: string[][]; 
  error?: string 
} {
  try {
    // Basic validation
    if (!csvData || csvData.trim() === '') {
      return { success: false, data: [], error: 'CSV file is empty' };
    }

    // Split by new lines
    const lines = csvData.split(/\r?\n/);
    if (lines.length < 2) {
      return { success: false, data: [], error: 'CSV file must have at least a header row and one data row' };
    }

    // Parse each line
    const parsedData = lines.map(line => {
      // Handle quoted values with commas inside them
      let inQuotes = false;
      let currentValue = '';
      const row: string[] = [];
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(currentValue.trim().replace(/^"(.+)"$/, '$1'));
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      row.push(currentValue.trim().replace(/^"(.+)"$/, '$1'));
      return row;
    });

    // Check for consistency in the number of columns
    const headerColumnCount = parsedData[0].length;
    const inconsistentRow = parsedData.findIndex(row => row.length !== headerColumnCount);
    
    if (inconsistentRow > 0) {
      return { 
        success: false, 
        data: [], 
        error: `Inconsistent column count at row ${inconsistentRow + 1}: Expected ${headerColumnCount} columns, got ${parsedData[inconsistentRow].length} columns` 
      };
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return { 
      success: false, 
      data: [], 
      error: error instanceof Error ? error.message : 'Unknown error parsing CSV data' 
    };
  }
}
