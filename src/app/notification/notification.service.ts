import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    permisson: boolean;
    notification: Notification;

    constructor() {
        this.init();
    }

    init() {
        // check if browser supports notification
        if (!('Notification' in window)) {
            console.error('This browser does not support notification');
            this.setPermission('denied');
        } else if (this.getPermission() !== 'denied') {
            try {
                Notification.requestPermission().then((permission) => {
                    this.setPermission(permission);
                });
            } catch (error) {
                // Safari doesn't return a promise for requestPermissions and it
                // throws a TypeError. It takes a callback as the first argument
                // instead.
                if (error instanceof TypeError) {
                    Notification.requestPermission(() => {
                        this.setPermission();
                    });
                } else {
                    this.setPermission('denied');
                    console.error(error);
                }
            }
        }
    }

    getPermission() {
        return Notification.permission;
    }

    setPermission(permission: string = '') {

        if (!permission) {
            permission = this.getPermission();
        }

        if (permission === 'granted') {
            this.permisson = true;
        } else if (permission === 'denied') {
            this.permisson = false;
        } else if (permission === 'default') {
            this.permisson = false;
        } else {
            this.permisson = false;
        }
    }

    send(title: string, options?: any) {
        if (this.permisson) {
            this.notification = new Notification(title);
        } else {
            console.error('Notifications not enabled.');
        }
    }

}
