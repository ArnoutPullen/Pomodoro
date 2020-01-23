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
        this.date = new Date('01-23-2020 16:30:58');
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
    }

    intervaler() {
        // timer
        // this.date = new Date();

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
        // before 12/14/16/18/20 etc. hours
        if (this.breakType === 'longBreak'
            && this.minute >= 60 - this.longBreak) {
            this.status = 'longBreak';
            calc = 50;
        } else if (this.breakType === 'shortBreak') {
            // 14:25/14:30 | 14:55/15:00 | 15:25/15:30
            // first: 14:25/14:30
            // third: 15:25/15:30
            if (this.minute >= (30 - this.shortBreak) && this.minute < 30) {
                if (this.minute < 25) {
                    calc = 25;
                } else {
                    calc = 30;
                }
                this.status = 'shortBreak';
                // second: 14:55/15:00
            } else if (this.hour % 2 === 0 && this.minute >= (60 - this.shortBreak)) {
                calc = 55;
                this.status = 'shortBreak';
            } else {
                // ???
                calc = 25;
            }
        } else {
            if (this.breakType === 'longBreak') {
                calc = 50;
            } else if (this.minute >= 30 && this.minute < 55) {
                calc = 55;
            } else if (this.minute < 25) {
                calc = 25;
            }
            this.status = 'iteration';
        }
        // calculate countdown
        this.calculateCountDown(calc);

        // Play sound with each transition
        // console.log(oldStatus);
        if (oldStatus !== this.status && oldStatus !== undefined) {
            this.play();
        }

        if (this.status === 'longBreak') {
            this.backgroundColor = '#D50000';
            this.text = 'Pauze voor ' + this.longBreak + ' minuten';
        } else if (this.status === 'shortBreak') {
            this.backgroundColor = '#FF6D00';
            this.text = 'Pauze voor ' + this.shortBreak + ' minuten';
        } else {
            this.backgroundColor = '#00C853';
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
