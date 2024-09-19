# Guess the NBA Player Game Project Proposal

## 1. Project Title

Role Player - Guess the NBA Player

## 2. Project Summary

The Role Player game is an interative web-based game where users are tasked with guessing an unknown NBA player based on various stats. The game flow will have the user guess a random NBA player, and the game will output whether or not the guessed players' stats (i.e: points per game, assists per game, height, position, etc.) are less than, greater than, or very close/equal to the unknown NBA player (A color gradient will signify one of these conditions). Based on this information, the player can then guess another NBA player that they believe have the relative stats compared to what they guessed previously.

The win condition of the game is to guess the correct NBA player. Columns shown will most liekly be points per game, assists per game, rebounds per game, position, college drafted from, along with other miscellaneous stats.

## 3. Description

Our project is a sports-themed guessing game where players aim to identify a mystery basketball player by making educated guesses based on key performance stats. Instead of using physical attributes like height or team division, the game will focus on statistical categories such as average points per game, average rebounds, assists, and shooting percentages. When players make a guess, the system will display a color gradient to indicate how close the guess is to the actual player’s stats—green representing closer matches, and red for guesses further away. Players use this feedback to narrow down their guesses, offering an engaging way to explore player performance metrics.

## 4. Creative Component

Taking a pre-existing game (Wordle) and integrating it with the NBA player database.
1. Developing an algorithm to compare player stats and generate color-coded feedback.
2. Creating an interactive, real-time visualization of stat comparisons.
3. Designing an adaptive hint system that analyzes user guesses and provides strategic clues based on statistical trends.

## 5. Usefulness

1. Educational Value. It helps users learn about NBA players and their statistical performances in an engaging way.
2. Entertainment. It provides a fun, daily challenge for basketball fans and trivia enthusiasts.
3. Skill Development. Regular players can improve their knowledge of NBA statistics and player comparisons.
4. Community Building. Leaderboards and shareable results create a sense of community among users.

While there are other NBA trivia games, our application is unique because it focuses on statistical comparisons and its Wordle-inspired gameplay mechanic. Unlike simple multiple-choice quizzes, our game requires analytical thinking and provides a more in-depth exploration of player performances.


## 6. Realness

Data will be sourced from:

1. NBA Stats API
   - Format: JSON
   - Size: Comprehensive stats for all active players (500+) and historical players (4000+)
   - Information: Game logs, advanced stats, shot chart data, etc.

2. Kaggle NBA Database
   https://www.kaggle.com/datasets/wyattowalsh/basketball
   - Format: CSV exports
   - Size: Career stats for all NBA players (4000+ rows per file)
   - Information: Players, Teams, Games, Player Stats, etc.

## 7. Functionality

The system should feature a user-friendly interface that allows players to easily input their guesses and view feedback. It will provide real-time stat comparisons, using color gradients to indicate how close the guess is to the actual player's performance metrics. The game will track key stats like points per game, average rebounds, assists, and shooting percentages. Additionally, the system should allow for daily challenges, leaderboard tracking, and hints based on statistical trends, making it engaging for both casual players and sports enthusiasts.

### Low-fidelity UI mockup

![image](https://github.com/user-attachments/assets/9cc97cbe-e6ce-4bbb-b754-15f28d55750a)

### Project work distribution

- Frontend Development (React): Sunny Chen, Matthew Tzeng
- UI/UX Design and Creative Components: Matthew Tzeng, Sunny Chen
- Backend API and Game Logic (Python/React/JSON): Sam Dong, Patrick Liu
- Database Management (SQL): Sam Dong, Matthew Tzeng, Patrick Liu, Sunny Chen

Each team member will be responsible for both frontend and backend aspects of their assigned features. Regular meetings will ensure integration and cohesive development across all components.
