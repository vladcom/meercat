import HTTPService from './HTTPService';
import { addParamsToUrl } from '../utils/helpers';

export default class CRUDService {
  APIService = new HTTPService();

  constructor(pathname) {
    this.pathname = pathname;
  }

  delete = async (body) => this.APIService.apiDelete(this.pathname, { body });

  deletePlace = async (id) => this.APIService.apiDelete(addParamsToUrl(`${this.pathname}/${id}`));

  update = async (body) => this.APIService.apiPatch(this.pathname, { body });

  getRequest = async (params) => this.APIService.apiGet(addParamsToUrl(this.pathname, params));

  getUserPlaces = async (params) => this.APIService.apiGet(addParamsToUrl(`${this.pathname}/${params}/places`));

  getImage = async (id) => this.APIService.apiGet(addParamsToUrl(`${this.pathname}/${id}`));

  getSelectedPlace = async ({ id }) => this.APIService.apiGet(addParamsToUrl(`${this.pathname}/${id}`));

  postRequest = async (body) => this.APIService.apiPost(this.pathname, { body });

  postUserPlacesRequest = async ({ id, body }) => this.APIService.apiPost(`${this.pathname}/${id}/place`, { body });

  editUserPlacesRequest = async ({ id, body }) => this.APIService.apiPost(`${this.pathname}/place/${id}`, { body });

  postPublicRequest = async (body) => this.APIService.apiPostPublic(this.pathname, { body });
}
