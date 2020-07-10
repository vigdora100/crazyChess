import React, { Component, createRef } from 'react';
import styled from 'styled-components'
import CompundTimer from 'react-compound-timer';


const TimerWrapper = styled.div`
    justify-content: space-evenly;
    display: flex;
    flex-direction: row;
    width: 80px;
    height: 30px;
    border-style: dashed;
    align-self: flex-end;
    margin: 5px 0 5px 0;
`

const DigitsWrapper = styled.div`

`

class Timer extends Component {
    constructor() {
        super();
        this.timerRef = createRef()

    }
    getCurrentTime = () => {
        return this.timerRef.current.getTime()
    }

    setTime = (time) => {
        return this.timerRef.current.setTime(time)
    }

    timerPause = ()=>{
         this.timerRef.current.pause();
    }

    timerResume = ()=>{
         this.timerRef.current.resume();
         console.log('resuming')
    }


    render() {
        const { initialTime, checkpoints } = this.props
        return (
            <CompundTimer
                initialTime={initialTime}
                direction="backward"
                checkpoints={checkpoints}
                ref={this.timerRef}>
                {() => (
                    <TimerWrapper>
                        <DigitsWrapper>
                            <CompundTimer.Minutes />
                        </DigitsWrapper>
                        <DigitsWrapper >
                            <CompundTimer.Seconds />
                        </DigitsWrapper>
                    </TimerWrapper>
                )}
            </CompundTimer >)

    }

}


export default Timer