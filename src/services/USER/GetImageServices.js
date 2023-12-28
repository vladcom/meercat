import CRUDService from '../CRUDService';
import { USER_URLS } from '../../constants/urls';

class GetImageServices extends CRUDService {
  constructor() {
    super(USER_URLS.GET_IMG);
  }
}

export default new GetImageServices();
