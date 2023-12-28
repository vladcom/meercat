import CRUDService from '../CRUDService';
import { USER_URLS } from '../../constants/urls';

class DeleteUserServices extends CRUDService {
  constructor() {
    super(USER_URLS.DELETE_USER);
  }
}

export default new DeleteUserServices();
