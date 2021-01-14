# GoodThings
To view the project go to: ~~https://goodthings.coultonfraser.com/~~

# Instantiating MongoDB on Local Device
Make sure you have MongoDB installed locally on your device

# For Windows
  Go to the root folder of MongoDB
      C:\Program Files\MongoDB\Server\<Version Number ie 3.4>\bin>
  run mongod with --dbpath set to the local copy of GoodThings
  
  .\mongod --dbpath C:\Users\Me\Documents\Good Things\data\
  
# For Mac
  In root folder of GoodThings, run the following command:
  
  sudo mongod --dbpath ./data
  

Now a MongoDB instance is running locally through that terminal using the database provided
by Good Things. 


# Interacting with the database

To interact with this database, run mongo in another terminal window
    Windows will need to run .\mongo through the MongoDB root folder
    MacOS can run mongo anywhere
    
Type 'show dbs' and make sure that Good_Things shows up as one of the databases
  - if it doesn't this means that the database may be running in the local directory of your 
  computer, not the Good_Things version
  
if Good_Things shows up, you can type 'use Good_Things' to enter the database.

From there, you can use the following commands:
  - show collections
  - db.listCommands()
  - db.help()

# Make sure to close the Database

To close the database, go back to the first terminal window and type Ctrl+C to exit the 
databse connection. The mongo instance will not be able to be used anymore, but you can
also use Ctrl+C to close that instance as well
