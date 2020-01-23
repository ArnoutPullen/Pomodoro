import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

    interval: any;
    audio: any;
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

    constructor() { }

    ngOnInit() {
        this.date = new Date("01-23-2020 15:50:58");
        this.startTimer();
        this.audio = new Audio();
        this.audio.src = "/assets/audio/schoolbel.mp3";
        this.audio.load();
        this.date = new Date("01-23-2020 15:50:56");
    }

    play() {
        this.audio.play();
    }

    calculateCountDown(endMin: any) {
        const min = this.date.getMinutes();
        const sec = this.date.getSeconds();

        const m = (59 - sec).toString().length == 1 ? '0' + (59 - sec) : 59 - sec;
        const s = (endMin - sec).toString().length == 1 ? '0' + (endMin - sec) : endMin - sec;

        this.countDown = ( 59 - min ) + ':' + s;
    }

    intervaler() {
        // timer
        // this.date = new Date();

        // pomodoro calculation
        const hour = this.date.getHours();
        const min = this.date.getMinutes();
        const sec = this.date.getSeconds();
        const oldStatus = this.status;

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
            // const m = (59 - sec).toString().length == 1 ? '0' + (59 - sec) : 59 - sec;
            // const s = (60 - sec).toString().length == 1 ? '0' + (60 - sec) : 60 - sec;
            // this.countDown = ( 59 - min ) + ':' + s;
            this.calculateCountDown(60);
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

        // Check if break starts
        if (oldStatus == 'iteration'
        && ( this.status == 'shortBreak' || this.status == 'longBreak' ) ) {
            this.play();
        }

        // Check if break ends
        if ( ( oldStatus == 'shortBreak' || oldStatus == 'longBreak' )
        && this.status == 'iteration' ) {
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
