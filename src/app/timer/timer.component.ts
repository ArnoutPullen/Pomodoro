import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification/notification.service';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

    // timer
    hour: number = 0;
    minute: number = 0;
    second: number = 0;

    // intervaler
    interval: any;
    date = new Date();

    // breaks and iteration time
    iteration = 30;
    shortBreak = 5;
    longBreak = 10;

    status?: string;
    breakType?: string;

    // UX
    text?: string;
    countDown: any;
    audio: any;
    class: string = '';

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        // start timer
        // this.date = new Date('01-23-2020 13:55:56');
        this.startTimer();

        // load audio
        this.audio = new Audio();
        this.audio.src = '/assets/audio/schoolbel.mp3';
        this.audio.load();
    }

    ngOnDestroy() {
        this.pauseTimer();
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    calculateCountDown(min = 60) {
        const m = String(min - this.minute - 1).padStart(2, '0');
        const s = String(60 - this.second).padStart(2, '0');

        this.countDown = `${m}:${s}`;
        document.title = `(${this.countDown}) Pomodoro`;
    }

    intervaler() {
        // timer
        this.date = new Date();

        // pomodoro magic
        this.hour = this.date.getHours();
        this.minute = this.date.getMinutes();
        this.second = this.date.getSeconds();
        const oldStatus = this.status;

        // determine next break type
        if ((this.hour + 1) % 2 === 0 && this.minute >= 30) {
            this.breakType = 'longBreak';
        } else {
            this.breakType = 'shortBreak';
        }

        // check if there is currently a break
        let calc = 60;
        // longBreak: before 12/14/16/18/20 etc. hours
        if (this.breakType === 'longBreak'
            && this.minute >= 60 - this.longBreak) {

            if (this.minute < 60 - this.longBreak) {
                calc = 60 - this.longBreak;
            }
            this.status = 'longBreak';

            // shortBreak: 14:25/14:30 | 14:55/15:00 | 15:25/15:30
            // first: 14:25/14:30
        } else if (this.breakType === 'shortBreak'
            && (this.hour % 2 === 0 && this.minute >= (30 - this.shortBreak) && this.minute < 30)) {

            if (this.minute < 30 - this.shortBreak) {
                calc = 30 - this.shortBreak;
            } else {
                calc = 30;
            }
            this.status = 'shortBreak';

            // second: 14:55/15:00
        } else if (this.breakType === 'shortBreak'
            && (this.hour % 2 === 0 && this.minute >= (60 - this.shortBreak))) {

            if (this.minute < 60 - this.shortBreak) {
                calc = 60 - this.shortBreak;
            }
            this.status = 'shortBreak';

            // third: 15:25/15:30
        } else if (this.breakType === 'shortBreak'
            && (this.hour % 2 === 1 && this.minute >= (30 - this.shortBreak) && this.minute < 30)) {

            if (this.minute < 30 - this.shortBreak) {
                calc = 30 - this.shortBreak;
            } else {
                calc = 30;
            }
            this.status = 'shortBreak';

        } else {
            // pomodoro
            if (this.breakType === 'longBreak') {
                calc = 60 - this.longBreak;
            } else if (this.minute >= 30 && this.minute < 60 - this.shortBreak) {
                calc = 60 - this.shortBreak;
            } else if (this.minute < 30 - this.shortBreak) {
                calc = 30 - this.shortBreak;
            }
            this.status = 'iteration';
        }

        // cancel short break before 12:30 (12:25/12:30)
        if (this.hour === 12 && this.minute < 30) {
            this.status = 'iteration';
            calc = 30;
        }
        // lunch break 12:30/13:30
        if (this.hour === 12 && this.minute >= 30) {
            this.status = 'lunch';
            calc = 60;
        }
        // lunch walk
        if (this.hour === 13 && this.minute < 30) {
            this.status = 'lunchWalk';
            calc = 30;
        }

        // calculate countdown
        this.calculateCountDown(calc);

        // Set visuals
        if (this.status === 'longBreak') {
            this.class = ' break long';
            this.text = 'Pauze voor ' + this.longBreak + ' minuten';
        } else if (this.status === 'shortBreak') {
            this.class = ' break short';
            this.text = 'Pauze voor ' + this.shortBreak + ' minuten';
        } else if (this.status === 'lunch') {
            this.class = ' break lunch';
            this.text = 'Lunch';
        } else if (this.status === 'lunchWalk') {
            this.class = ' walk lunch';
            this.text = 'Take a Walk';
        } else {
            this.class = ' pomodoro';
            this.text = 'Pomodoro';
        }

        // Transition
        if (oldStatus !== this.status && oldStatus !== undefined) {
            // Play sound with each transition
            this.play();

            // Send browser notification
            if (oldStatus === 'iteration') {
                this.notificationService.send('Start: ' + this.text);
            } else if (oldStatus === 'shortBreak') {
                this.notificationService.send('Einde: ' + 'Pauze voor ' + this.shortBreak + ' minuten');
            } else if (oldStatus === 'longBreak') {
                this.notificationService.send('Einde: ' + 'Pauze voor ' + this.longBreak + ' minuten');
            }
        }
    }

    startTimer() {
        this.interval = setInterval(() => {
            this.intervaler();
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.interval);
    }
}
