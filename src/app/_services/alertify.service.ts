import { Injectable } from '@angular/core';
// This make alertify available. I guess this is how we inject in angular 3rd part aps.
// https://hackernoon.com/angular-providers-how-to-inject-3rd-party-library-af4a78722864
declare let alertify: any;

@Injectable()
export class AlertifyService {

constructor() { }


confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, function(e) {
        if (e) {
            okCallback();
        } else {
        }
    });
}

success(message: string) {
    alertify.success(message);
}

error(message: string) {
    alertify.error(message);
}

warning(message: string) {
    alertify.warning(message);
}

message(message: string) {
    alertify.message(message);
}
}
