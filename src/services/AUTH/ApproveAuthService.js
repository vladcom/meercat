import CRUDService from '../CRUDService';
import { USER_URLS } from '../../constants/urls';

class ApproveAuthService extends CRUDService {
  constructor() {
    super(USER_URLS.APPROVE_AUTH_BY_PHONE);
  }
}

export default new ApproveAuthService();
