DELIMITER // ;
CREATE PROCEDURE `uspRemoveTeams`(IN twitName varchar(50))
BEGIN

SELECT * FROM userTeams where UserName = twitName ;

END