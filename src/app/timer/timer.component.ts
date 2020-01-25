import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

    // timer
    hour: number;
    minute: number;
    second: number;

    interval: any;
    date = new Date();

    iteration: 30;
    shortBreak = 5;
    longBreak = 10;

    status: string;
    breakType: string;

    // visuals
    backgroundColor: string;
    text: string;
    countDown: any;
    audio: any;

    constructor() { }

    ngOnInit() {
        // start timer
        // this.date = new Date('01-23-2020 12:29:56');
        this.startTimer();

        // load audio
        this.audio = new Audio();
        this.audio.src = '/assets/audio/schoolbel.mp3';
        this.audio.load();
    }

    play() {
        this.audio.play();
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

            if (this.breakType === 'longBreak') {
                calc = 60 - this.longBreak;
            } else if (this.minute >= 30 && this.minute < 60 - this.shortBreak) {
                calc = 60 - this.shortBreak;
            } else if (this.minute < 30 - this.shortBreak) {
                calc = 30 - this.shortBreak;
            }
            this.status = 'iteration';
        }

        // lunch break
        if (this.hour === 11 && this.minute > 55) {
            this.status = 'iteration';
            calc = 60;
        }
        if (this.hour === 12 && this.minute < 30) {
            this.status = 'lunch';
            calc = 30;
        }

        // calculate countdown
        this.calculateCountDown(calc);

        // Play sound with each transition
        if (oldStatus !== this.status && oldStatus !== undefined) {
            this.play();
        }

        if (this.status === 'longBreak') {
            this.backgroundColor = '#00C853';
            this.text = 'Pauze voor ' + this.longBreak + ' minuten';
        } else if (this.status === 'shortBreak') {
            this.backgroundColor = '#FF6D00';
            this.text = 'Pauze voor ' + this.shortBreak + ' minuten';
        } else if (this.status === 'lunch') {
            this.backgroundColor = '#00C853';
            this.text = 'Lunch';
        } else {
            this.backgroundColor = '#D50000';
            this.text = 'Pomodoro';
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
