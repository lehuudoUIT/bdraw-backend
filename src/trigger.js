let db = require("./models/index");

const createTrigger = async (trigger) => {
  try {
    await db.sequelize.query(trigger);
    console.log("Creating trigger");
    console.log("------------------");
  } catch (error) {
    console.log(error);
    console.log("Create trigger fail, check connect to database!");
  }

  return;
};

let TRIGGER_set_min_score = `
CREATE TRIGGER set_min_score 
BEFORE
UPDATE ON Players
FOR EACH ROW
BEGIN
	-- If new score under 0, it will set score to 0
	IF NEW.score < 0 THEN
        SET NEW.score = 0;
	END IF;
END
`;

let TRIGGER_update_rank_player = `
CREATE TRIGGER update_rank_player
BEFORE UPDATE ON Players
FOR EACH ROW
BEGIN
    IF NEW.score < 500 THEN
        SET NEW.rankId = 0;
    ELSEIF NEW.score >= 500 AND NEW.score < 1000 THEN
        SET NEW.rankId = 1;
    ELSEIF NEW.score >= 1000 AND NEW.score < 2000 THEN
        SET NEW.rankId = 2;
    ELSEIF NEW.score >= 2000 AND NEW.score < 4000 THEN
        SET NEW.rankId = 3;
    ELSEIF NEW.score >= 4000 AND NEW.score < 8000 THEN
        SET NEW.rankId = 4;       
    ELSEIF NEW.score >= 8000 AND NEW.score < 15000 THEN
        SET NEW.rankId = 5;   
    ELSEIF NEW.score >= 15000 AND NEW.score < 30000 THEN
        SET NEW.rankId = 6;
    ELSEIF NEW.score >= 30000 AND NEW.score < 40000 THEN
        SET NEW.rankId = 7;
    ELSEIF NEW.score >= 40000 AND NEW.score < 100000 THEN
        SET NEW.rankId = 8;
    ELSEIF NEW.score >= 100000 THEN
        SET NEW.rankId = 9;            
    END IF;
END
`;

createTrigger(TRIGGER_set_min_score);
createTrigger(TRIGGER_update_rank_player);
