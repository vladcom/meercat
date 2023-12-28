import CRUDService from '../CRUDService';
import { API_URLS } from '../../constants/urls';

class PostNewLocationsService extends CRUDService {
  constructor() {
    super(API_URLS.CREATE_LOCATION);
  }
}

export default new PostNewLocationsService();
