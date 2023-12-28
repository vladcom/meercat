export const formatCategoryType = (type) => {
  switch (type) {
    case 1:
      return 'Shooting';
    case 2:
      return 'Violence';
    case 3:
      return 'Theft';
    case 4:
      return 'Accident';
    case 5:
      return 'Injured';
    case 6:
      return 'Homeless';
    case 7:
      return 'Child related';
    case 8:
      return 'Lost Adult';
    case 9:
      return 'Lost Pet';
    case 10:
      return 'Disturbance';
    case 11:
      return 'Inappropriate';
    case 12:
      return 'Protest';
    case 13:
      return 'Fire';
    case 14:
      return 'Flooding';
    case 15:
      return 'Other';
    default:
      return 'shooting';
  }
};
