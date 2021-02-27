# Dr Mario for Atari 800 clone
### WARNING: it's best to run it using LiveServer extension for VS: Code

This is a project for Client Applications lessons.
It's a clone of singleplayer gameplay part of Dr Mario game for Atari 800.

Missing features:
* Main menu - game starts in the first level
* Options - you can't change the game speed of virus level
* Ending - game doesn't end, it just get harder until the board is too full to play
* Multiplayer mode
* Music

Note: I started this project later than I should, so I had to be quick to finish before the deadline.
It's by no means perfect and I made some bad decisions at the start, that were too big to change later and gave me a lot of troubles.
The big one was a pill dropping system. It is based on timeouts, which introduces a lot of unnecessary complexity, forces me to use complex ways to solve simple problems in some cases, and generally negatively impacts readability.
If I were to remake it, I would go for a different system, that would be easier to modify, but I consider this project done for now.
