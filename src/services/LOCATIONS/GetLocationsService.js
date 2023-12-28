import CRUDService from '../CRUDService';
import { API_URLS } from '../../constants/urls';

class GetLocationsService extends CRUDService {
  constructor() {
    super(API_URLS.LOCATIONS);
  }
}

export default new GetLocationsService();
