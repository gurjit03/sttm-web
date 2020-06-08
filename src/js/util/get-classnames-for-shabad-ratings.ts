export const getClassnamesForShabadRatings = (avgScore: number): string => {
  if (avgScore >= 75) {
    return 'Excellent'
  } else if (avgScore >= 40) {
    return 'Good';
  }
  return 'Poor'
}