import { ContentEntry } from '../types';

const escapeCsvField = (field: string | number): string => {
  const stringField = String(field);
  // If the field contains a comma, double quote, or newline, enclose it in double quotes.
  if (/[",\n\r]/.test(stringField)) {
    // Also, double up any existing double quotes.
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

export const downloadContentAsCSV = (content: ContentEntry[]) => {
  if (!content || content.length === 0) {
    return;
  }

  const headers = ['Day', 'Platform', 'Content Type', 'Idea/Hook', 'Caption', 'Hashtags'];
  const csvRows = [headers.join(',')];

  content.forEach(entry => {
    const row = [
      entry.day,
      escapeCsvField(entry.platform),
      escapeCsvField(entry.contentType),
      escapeCsvField(entry.idea),
      escapeCsvField(entry.caption),
      escapeCsvField(entry.hashtags)
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'AI_Content_Plan.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};