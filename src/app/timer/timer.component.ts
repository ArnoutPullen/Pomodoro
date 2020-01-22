import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

    timer: number;
    interval;
    date = new Date();
    time: string;

    // startTime: number[] = [8, 0];
    // endTime: number[] = [18, 0];

    iteration: 30;
    shortBreak = 5;
    longBreak = 15;

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
        // this.timer = this.date.getTime();

        // pomodoro calculation
        const hour = this.date.getHours();
        const min = this.date.getMinutes();
        // const minutesLeft = min > 30 ? min - 30 : min;
        // let breakTimeStart = 30 - this.shortBreak;

        // determine next break type
        if ((hour + 1) % 2 === 0 && min >= 30) {
            this.breakType = 'longBreak';
            // breakTimeStart = 30 - this.longBreak;
        } else {
            this.breakType = 'shortBreak';
        }

        // check if there is currently a break
        // before 12/14/16/18/20 etc. hours
        if (this.breakType === 'longBreak'
        && min >= 45) {
            this.status = 'longBreak';
        // 14:25/14:30 | 14:55/15:00 | 15:25/15:30
        // TODO: bugfix 15:30:15
        } else if (this.breakType === 'shortBreak'
        && ( hour % 2 === 0 && min >= 25 && min <= 30 ) // first: 14:25/14:30
        || ( hour % 2 === 0 && min >= 55 ) // second: 14:55/15:00
        || ( hour % 2 === 1 && min >= 25 && min <= 30 ) ) { // third: 15:25/15:30
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

        // check if time is between startTime and endTime
        /*
        if (this.date.getHours() >= this.startTime[0] // 7 | 8
        && ( this.date.getHours() === this.startTime[0] && this.date.getMinutes() >= this.startTime[1] )
        && this.date.getHours() <= this.endTime[0]
        && ( this.date.getHours() === this.endTime[0] && this.date.getMinutes() <= this.endTime[1]) ) {
            this.start();
        } else {
            console.log('stopped worktime over');
            this.pauseTimer();
        }
        */
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
