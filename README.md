# coderunner


Routes 

/ - Form to submit code

/submit -post route

 
files:<br>
problem link -https://www.spoj.com/problems/MAXWOODS/ <br>
editorial.cpp -sample program  <br>
in.txt - input file <br>
req.txt - expected output <br>



using docker 

1. docker build -t coderunner .     <strong> (the dot is important) </strong> <br>
2. docker run -p 8080:8080 -d coderunner  <br>
