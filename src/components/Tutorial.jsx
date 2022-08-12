import React, { Component } from 'react';

class Tutorial extends Component {
    render() {
        return (
            <div>
                <p>
                    The goal of Word Sparky is to solve a puzzle by figuring out
                    all of the letters correctly. Start by guessing any six
                    letters. Every place in the puzzle with these letters will
                    be shown. Next, try to solve the puzzle by guessing the
                    remaining letters. Don't worry, if you get it wrong, you can
                    keep trying.
                </p>
                <h4>Video: How To Solve A Puzzle</h4>
                <video width="320" height="240" controls>
                    <source src="../SolvePuzzle.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <p>
                    Every day, three bot puzzles are created for your enjoyment.
                </p>
                <h4>Video: Bot Puzzles</h4>
                <video width="320" height="240" controls>
                    <source src="../BotPuzzles.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <p>
                    However, Word Sparky is more fun if you play with friends.
                    If you have a friend who also plays Word Sparky, you can
                    send them custom-made puzzles (both of you must be
                    registered).
                </p>
                <h4>Video: How To Create A Puzzle</h4>
                <video width="320" height="240" controls>
                    <source src="../CreatePuzzle.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <p>The Home Screen shows all of your "active" puzzles.</p>
                <h4>Video: Home Screen</h4>
                <video width="320" height="240" controls>
                    <source src="../HomeScreen.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <p>
                    Visit our YouTube page (GooglyPower Software) for more
                    videos on how to play.
                </p>
            </div>
        );
    }
}

export default Tutorial;
