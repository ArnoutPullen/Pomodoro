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
            this.setPermission();
        } else if (this.getPermission() !== 'denied') {
            Notification.requestPermission().then((permission) => {
                this.setPermission();
            });
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
        this.notification = new Notification(title);
    }

}
