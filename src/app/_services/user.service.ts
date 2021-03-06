import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, RequestOptions, Headers, Jsonp, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/User';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';
import { PaginatedResult } from '../_models/Pagination';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) {}

  getUsers(page?: number, itemsPerPage?: number, userParams?, likesParam?) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();
    let queryString = '?';
    if (page != null && itemsPerPage != null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage;
    }

    if (userParams != null) {
      queryString += '&minAge=' + userParams.minAge;
      queryString += '&maxAge=' + userParams.maxAge;
      queryString += '&gender=' + userParams.gender;
      queryString += '&orderBy=' + userParams.orderBy;
    }

    if (likesParam === 'Likers') {
      queryString += '&likers=' + 'true';
    }

    if (likesParam === 'Likees') {
      queryString += '&likees=' + 'true';
    }

    return this.authHttp
      .get(this.baseUrl + 'users' + queryString)
      .map((response: Response) => {
        console.log(response.json());
        console.log(response.headers.get('Pagination'));
        paginatedResult.result = response.json();

        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }

        return paginatedResult;
      })
      .catch(this.handleError);
  }

  getUser(id): Observable<User> {
    return this.authHttp
      .get(this.baseUrl + 'users/' + id)
      .map(response => <User>response.json())
      .catch(this.handleError);
  }

  updateUser(id: number, user: User) {
    return this.authHttp
      .put(this.baseUrl + 'users/' + id, user)
      .catch(this.handleError);
  }

  setMainPhoto(userId: number, id: number) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {})
      .catch(this.handleError);
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp
      .delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
      .catch(this.handleError);
  }

  sendLike(id: number, recipientId: number) {
    return this.authHttp.post(
      this.baseUrl + 'users/' + id + '/like/' + recipientId,
      {}
    );
  }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');

    if (applicationError) {
      return Observable.throw(applicationError);
    }
    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return Observable.throw(modelStateErrors || 'Server error');
  }
}
