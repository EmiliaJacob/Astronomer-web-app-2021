#!/bin/bash
cd /app/Userservice
(npm start)& 
cd ../frontend
ng serve --host 0.0.0.0