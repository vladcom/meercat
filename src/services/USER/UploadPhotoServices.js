import CRUDService from '../CRUDService';
import { USER_URLS } from '../../constants/urls';

class UploadPhotoServices extends CRUDService {
  constructor() {
    super(USER_URLS.UPLOAD_PHOTO);
  }
}

export default new UploadPhotoServices();
