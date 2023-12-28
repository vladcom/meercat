export const formatCategoryName = (str) => {
  switch (str) {
    case 'gun-violence':
      return 'Gun Violence';
    case 'knife':
      return 'Other Violence';
    case 'accident':
      return 'Accident';
    case 'child':
      return 'Child Endangerment';
    case 'homeless':
      return 'Homeless Person';
    case 'hurt-person':
      return 'Injured Person';
    case 'other':
      return 'Protest';
    case 'fire':
      return 'Fire';
    case 'flooding':
      return 'Flooding';
    case 'illegal-activity':
      return 'Bad / illegal Behavior';
    case 'noisy':
      return 'Loud Noise';
    case 'danger':
      return 'Other Danger';
    default:
      return 'Alert';
  }
};
