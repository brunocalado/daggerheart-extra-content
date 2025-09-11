const adversaryCritical = 20; // Change to 19 for Age of Umbra

// critArgs: { roll, message }
const { roll } = critArgs;

if (roll.title==='D20 Roll') {
  const die1 = roll.dice[0].results[0].result;

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