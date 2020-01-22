import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

    interval;
    date = new Date();

    iteration: 30;
    shortBreak = 5;
    longBreak = 10;

    status: string;
    breakType: string;

    // visuals
    backgroundColor: string;
    text: string;

    constructor() { }

    ngOnInit() {
        this.startTimer();
    }

    intervaler() {
        // timer
        this.date = new Date();

        // pomodoro calculation
        const hour = this.date.getHours();
        const min = this.date.getMinutes();

        // determine next break type
        if ((hour + 1) % 2 === 0 && min >= 30) {
            this.breakType = 'longBreak';
        } else {
            this.breakType = 'shortBreak';
        }

        // check if there is currently a break
        // before 12/14/16/18/20 etc. hours
        if (this.breakType === 'longBreak'
        && min >= 60 - this.longBreak) {
            this.status = 'longBreak';
        // 14:25/14:30 | 14:55/15:00 | 15:25/15:30
        } else if (this.breakType === 'shortBreak'
        && ( hour % 2 === 0 && min >= ( 30 - this.shortBreak ) && min < 30 ) // first: 14:25/14:30
        || ( hour % 2 === 0 && min >= ( 60 - this.shortBreak ) ) // second: 14:55/15:00
        || ( hour % 2 === 1 && min >= ( 30 - this.shortBreak ) && min < 30 ) ) { // third: 15:25/15:30
            this.status = 'shortBreak';
        } else {
            this.status = 'iteration';
        }

        if (this.status === 'longBreak') {
            this.backgroundColor = '#00C853';
            this.text = 'Pauze voor ' + this.longBreak + ' minuten';
        } else if (this.status === 'shortBreak') {
            this.backgroundColor = '#FF6D00';
            this.text = 'Pauze voor ' + this.shortBreak + ' minuten';
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
