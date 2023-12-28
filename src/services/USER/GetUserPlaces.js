import CRUDService from '../CRUDService';
import { USER_URLS } from '../../constants/urls';

class GetUserPlaces extends CRUDService {
  constructor() {
    super(USER_URLS.USER);
  }
}

export default new GetUserPlaces();
