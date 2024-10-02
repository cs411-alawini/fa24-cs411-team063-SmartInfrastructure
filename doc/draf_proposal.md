
# NBA Team Builder

## 1. Project Title

NBA Team Builder

## 2. Project Summary

The NBA Team Builder game is an interactive web-based game where users are tasked with creating an five-man NBA roster which conform to the daily requirement. The requirement will be based off of a certain line of statistics such as points per game, or college attended. The idea of the game is to create the cheapest roster which satisfies the daily requirement.

The win condition of the game is to successfully create a roster which abides by the requirements, although to truly win, you must create the cheapest roster for the day.

## 3. Description

The NBA Team Builder project centers around creating a five-man NBA roster that meets specific daily requirements based on player statistics such as points per game, assists, rebounds, shooting percentages, or even details like the college they attended. The game challenges users to form the most cost-effective roster that satisfies the given conditions.

The key twist is that users must create the cheapest valid lineup from available players, and the system provides instant feedback on guesses using color-coded hints.

Each day presents a new challenge, and players must use knowledge of NBA statistics and strategic thinking to outsmart the system. This offers a balance between fun and education, giving users a deeper understanding of player metrics in a dynamic and interactive way.

Users will be able to view and become inspired by other people's rosters once they've submitted their own. Users will be able to create accounts and login to the website and be able to pull up stats based on their participation.

## 4. Creative Component

This game blends fantasy sports with the unique challenge of creating a low-cost team. Unlike traditional games where users pick their dream team based on performance only, here the challenge is to optimize for cost-efficiency while meeting strict statistical criteria. The addition of feedback through color-coded hints inspired by the Wordle game mechanics adds a unique element, encouraging players to improve through multiple attempts, while also creating opportunities for leaderboards and competition among players.

## 5. Usefulness


-   **Educational Value:** Users gain knowledge about NBA players and their stats in a fun, engaging way. The game helps basketball fans familiarize themselves with key metrics and compare player performances.
-   **Entertainment:** The daily challenges offer a consistent, enjoyable experience, appealing to basketball fans and those who enjoy puzzle-like games.
-   **Skill Development:** Regular users can enhance their analytical thinking skills, especially in terms of recognizing patterns in player stats and making strategic decisions to build an optimal team.
-   **Community Building:** Leaderboards, shareable scores, and friendly competition drive community engagement. Players can compare rosters and strategies, fostering a sense of camaraderie and rivalry.


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
 3. Scraped Data from Basketball-Reference
	-	Format: CSV exports & Excel sheets
	-	Size: Salaries and colleges for each player
	-	Information: Yearly salaries for each player every year + colleges attended

## 7. Functionality

The game will offer an intuitive user interface where players can submit guesses and receive real-time feedback based on how close their choices are to meeting the daily statistical requirements. The color gradient feature provides a clear, visual representation of how well a guess aligns with the required metrics, informing users whether they were close or not.

### Low-fidelity UI mockup

![cs411 demo](https://github.com/user-attachments/assets/ffb4ab7a-4aff-4977-9f0f-9b10777d2f66)

### Project work distribution

- Frontend Development (React): Sunny Chen, Matthew Tzeng
- UI/UX Design and Creative Components: Matthew Tzeng, Sunny Chen
- Backend API and Game Logic (Python/React/JSON): Sam Dong, Patrick Liu
- Database Management (SQL): Sam Dong, Matthew Tzeng, Patrick Liu, Sunny Chen

Each team member will be responsible for both frontend and backend aspects of their assigned features. Regular meetings will ensure integration and cohesive development across all components.
