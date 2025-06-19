
export const getResponseColor = (response: string) => {
  switch(response) {
    case 'yes':
      return 'bg-blitz-green/20 text-blitz-green border-blitz-green';
    case 'maybe':
      return 'bg-blue-600/30 text-blue-400 border-blue-500';
    case 'no':
      return 'bg-red-600/20 text-red-400 border-red-800';
    case 'pending':
      return 'bg-blue-600/30 text-blue-400 border-blue-500';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-800';
  }
};

export const getResponseText = (response: string) => {
  switch(response) {
    case 'yes':
      return 'Committed';
    case 'maybe':
      return 'Pending';
    case 'no':
      return 'Not Available';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};
