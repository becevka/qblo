qblo
====

qblo is an Collaborative whiteboard tool

qblo (pronunciation:  /kuˈblo/) project specification

qblo is an Collaborative whiteboard tool
(the closest analogue http://walmademo.opinsys.fi/)

Main features:
--------------
1. **Login/Registration (LS)** - based on email and password field. Should be simple. If there was no user we are creating new one with email and password specified. User name is created from part of email before @ sign.
2. **Dashboard screen (DS)** - list of all visited/created boards (dashboard name and users that took part in it), ability to create new board
3. **Whiteboard screen (WS)** - canvas with ability to use black pencil, 5px width for drawing and ctrl+z for removing last operation. Any user (even not registered/logged-in) will see board when visits a link. Only logged-in user will be able to edit board.
User see updates immediately and message shown when new user arrived/left board.
4. **History view (HV)** - On top of board see(may be hidden) header with revision number and user name, who made change, ability to navigate back an forth through revisions history. When user visit different revisions (except the last) whiteboard updates will stop and ability to edit it will be disabled until he is back to the head revision.  

Additional features road map:
-----------------------------
1. Change user name. In DS click on user name in welcome message and type new name.
2. Change whiteboard name. In DS click on whiteboard name in list and type new name. In HV have a whiteboard name to click on and change name. Name could be changed only by user, who created it. 
3. Play whiteboard painting using history
4. Remove whiteboard
5. Create private, protected, public whiteboards. Private means board available only to owner and users whom he give a special link with secret key. Protected means board available for registered users only. Public available for every visitor, registered users are able to edit.
6. Add ability to change color, draw tool thickness 
7. Drawing correction. When user draws an circle and it off course will not be ideal, program corrects form of circle (could be canceled by ctrl +z). Extended corrections for different forms like trees, cats, people, house etc.

Technical suggestions:
----------------------
1. **Color scheme**: #474644 - dark grey and #E6F3FF pale blue
2. **Font**: Happy Monkey<link href='http://fonts.googleapis.com/css?family=Happy+Monkey' rel='stylesheet' type='text/css'>
3. **UI**: KnockoutJS, Twitter Bootstrap(partial), Backbone?, Canvas drawing?, Sockets or another long pooling technology 
4. **Server**: Prototype and choose the best  - NodeJS, Scala, Python, Clojure, Erlang
5. **DB**: MongoDB


DB structure:
-------------
1. **User** - name, email(unique), password(sha512 hash with salt), boards(list)
2. **Whiteboard** - name, owner(user), creation_time, users (list), revisions(list)
3. **Revision** - revision_number, moves (sequence list of points), author(user), creation_time 
4. **Point** - x, y

REST:
-----
1. POST **/auth** email, password - log-in or register and log-in user and returns user info 
2. GET **/dashboard** - returns user's boards list
3. POST* **/board** name - create new board and returns board info
4. GET **/board/id** - returns board info
5. GET **/board/id/revision/number** - returns board info for revision
6. GET **/board/id/draw/next** - waits for next change and returns only that change
7. GET **/board/id/draw/revision_number** - returns revision's change
8. POST* **/board/id/draw/** draw - adds new draw to the board
9. DELETE* **/board/id/draw/revision_number** - removes draw if user is it's author
 
\* -requires additional key in POST/DELETE parameters to avoid CSRF

