EEG-UI
==============
One web-base EDF visualization and analysis tool

Introduction
------------
![enter image description here](https://i.ibb.co/K6XnDd9/EEG-UI.png)
EEG-UI is an web-based EDF file visualization tool that I have developed as a part of my bechalor degree graduation thesis. I have designed this tool to be an analysis tool that simplifies analysis off EEG data. It allows users to visualize EEG data and perform basic preprocessing operations. EEG-UI is developed with flask and basic web technologies as jquery, css, html. I will be maintaining this tool as an Open Sourced online platform. Reach me for your feedbacks:
mail: taha.m.gokdemir@gmail.com

Platform support
----------------
It is tested in ubuntu 18.04 but also should work in the other platforms that suppot Python3.

How can I try this out?
-----------------------
Clone this repo

    $git clone https://github.com/tahameg/EEG-UI.git
Install Virtualenv

    sudo pip3 install virtualenv
Go to the root folder

    cd eeg-ui 
 Start Virtualenv

     source venv/bin/activate

 Install Dependencies

     pip -r requirements.txt


Run the app
	   
    python app.py

## SELF-CRITIC

Even if the research and writing phases took months throughout this project, I couldn't spend enough time for development of this application. So, the codebase is like a mess especially on the front-end side. I will first focus on cleaning the codebase. Then we will see where this project goes.