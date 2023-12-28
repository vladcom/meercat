import CRUDService from '../CRUDService';
import { USER_URLS } from '../../constants/urls';

class PhoneVerificationService extends CRUDService {
  constructor() {
    super(USER_URLS.PHONE_VERIFICATION);
  }
}

export default new PhoneVerificationService();
