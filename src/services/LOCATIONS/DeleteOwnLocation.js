import CRUDService from '../CRUDService';
import { API_URLS } from '../../constants/urls';

class DeleteOwnLocation extends CRUDService {
  constructor() {
    super(API_URLS.DELETE_PLACE);
  }
}

export default new DeleteOwnLocation();
