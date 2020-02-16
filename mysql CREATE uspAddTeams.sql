DELIMITER // ;
CREATE PROCEDURE `uspAddTeams`(IN twitName varchar(50), teamsToAdd varchar(255))
BEGIN

INSERT INTO userTeams (UserName, Team)
VALUES (twitName, 

SELECT teams FROM userTeams where UserName = twitName ;

END

TRUNCATE TABLE userteams