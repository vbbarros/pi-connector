# PI-CONNECTOR

    __________.__          _________                                     __                
    \______   \__|         \_   ___ \  ____   ____   ____   ____   _____/  |_  ___________ 
     |     ___/  |  ______ /    \  \/ /  _ \ /    \ /    \_/ __ \_/ ___\   __\/  _ \_  __ \
     |    |   |  | /_____/ \     \___(  <_> )   |  \   |  \  ___/\  \___|  | (  <_> )  | \/
     |____|   |__|          \______  /\____/|___|  /___|  /\___  >\___  >__|  \____/|__|   
                                   \/            \/     \/     \/     \/                  

|
    ------------------------------------
    -- Last modification : 28/03/2020 --
    ------------------------------------
# Overview
Pi-connector was built for search information on PIMS. Pi-connect is based in REST architeture.
This application was built with nodeJS. Follow the tech details above:

* NodeJS
* Yarn

# DEVELOPMENT
Requirements : 

    - Git installed
    - NodeJs installed
    - YARN installed

* Clone repository : https://github.com/vbbarros/pi-connector
* Install all dependencies : yarn install
* Create a .env file like the .env.example with the correct enviroments variables, based on your PI structure
* Run application : yarn dev

Endpoitns :

 - GET
    * /healthz
        Returns a boolean indicating whether the application is standing or not

 - POST
    * /searchAttributes/values
        Fetch attribute data within a specified time range
        - Params:
            - webid: (String) webid of element or attribute you want to get the values
            - startDateTime: (String) start of interval that you want to search. Format: YYYY-MM-DD HH:mm:ss
            - endDateTime: (String) end of interval that you want to search. Format: YYYY-MM-DD HH:mm:ss
            - interval: (String) sampling interval between startDateTime and endDateTime. Format: HH:mm:ss
            - attributes: (Array) All the attributes that you want to search. Example: ["MV", "PV"]
            - isSubattribute: (String) Indicates whether the webid is from an attribute or an element ("true" or "false")

    * /searchAttributes/webids        
        Fetch attribute webids inside a element or attribute
        - Params:
            - webid: (String) webid of element or attribute you want to get the values
            - attributes: (Array) All the attributes that you want to search. Example: ["SP", "PV"]
            - isSubattribute: (Boolean) Indicates whether the webid is from an attribute or an element
