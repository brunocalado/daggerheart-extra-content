// VERSION 1.0
const adversaryCritical = 20; // Change to 19 for Age of Umbra

// critArgs: { roll, message }
const { roll } = critArgs;

if (roll.title==='D20 Roll') {
  const die1 = roll.dice[0].results[0].result;
  let die2;

  if ( roll.hasAdvantage || roll.hasDisadvantage ) {
    die2 = roll.dice[0].results[1].result;
    if ( roll.hasAdvantage && ( die1 >= adversaryCritical || die2 >= adversaryCritical ) ) {
      return true;
    } else if ( roll.hasDisadvantage && ( die1 >= adversaryCritical && die2 >= adversaryCritical ) ) {
      return true;  
    } else {
      return false;
    }
  } 
  
  // Daggerheart
  if (die1 >= adversaryCritical) {
    return true;
  } else {
    return false;  
  }
  
} else if (roll.title==="Duality Roll") {
  const die1 = roll.dice[0].results[0].result;
  const die2 = roll.dice[1].results[0].result;

  // Daggerheart
  if (die1 === die2) {
    return true;
  } else {
    return false;  
  }  
}