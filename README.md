# Relink
##### CS428/429 group project proposal
## Description
- A centralized web platform that allows students to interact more during lectures.
- Lecturers can create a virtual classroom on the platform and generate a class code. The students who are in the lecture can access the virtual classroom via this class code.
- The virtual classroom exists in parallel with the real classroom, while students can communicate/discuss/ask questions during class through the virtual classroom, even with the option to perform these activities anonymously. In this way, students are more encouraged to speak out and participate in class.
- Lecturers can adjust the lecture (speed, content, reaction, etc.) in real-time based on the activities feedbacks in the virtual classroom.
Lecturers can post questions in the virtual classroom in many forms, not limited to traditional multiple choices. Questions could even be forms of competition such as only who answers fastest wins or divide student into groups to compete with each other. Students can win points, medals, achievements, etc.
- All these are intended to make students more focused in the lecture and to make the learning process more effective and with more pleasure.
## Motivation
- In many classes, the lectures are very plain and dry. It would take a lot of effort for students to keep focusing in the lectures. This could cause lower learning efficiency and lower attendance rate (students will think that they cannot focus and learn in lecture anyway, so they will decide not to attend)
- Most students are usually too shy to express themselves in lecture. This is often shown by the awkward quietness after lecturers ask a question or are trying to confirm if everyone is catching up.
Students are unwilling to talk to strangers next to them even when instructors tell them to. Anonymous communication could be a good kickstart.
## Comparison with similar software
##### Piazza
- Similarity:
  - Directly related to one class
  - Supports anonymous communication
- Difference:
  - Not in real-time
##### Iclicker
- Similarity:
  - Used to do quizzes
  - Boosts attendance in class
  - Give lectures insight about teaching effectiveness
- Difference:
  - Does not boost communication
  - Question forms are not fun
## Programming languages, libraries, frameworks, platforms
- Backend: python, Nodejs
- Chat-service: Socket.io
- Frontend: React
- Database: MongoDB
- Environment: Unix based OS
## Risks/Challenges
- Build real-time communication system.
- Build with performance in mind. (Many classrooms, many conversations, add classrooms on the fly, etc.)
- Build user-friendly user interface (always very challenging).
System testing of the whole project.
Build with security in mind.

## Configuration and Deployment
See <a href = "https://github.com/zmz0305/relink/wiki/Configuration-Manual">Repository Wiki Page</a> for Configuration Manual.

## Project Documentation
See <a href = "https://github.com/zmz0305/relink/wiki/Project-Documentation"></a>
