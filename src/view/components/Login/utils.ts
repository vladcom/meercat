import { isValidPhoneNumber } from 'react-phone-number-input';

export const isPhoneDevMode = (phone: string) => phone.includes('+12222');

export const isPhoneValid = (phone: string) => isPhoneDevMode(phone) || isValidPhoneNumber(phone);
