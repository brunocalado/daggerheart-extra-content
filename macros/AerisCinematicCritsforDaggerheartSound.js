// VERSION 1.2

/* Suggested path sounds
modules/daggerheart-extra-content/assets/sfx-critical/adv-critical-tension-impact.mp3
modules/daggerheart-extra-content/assets/sfx-critical/adv-horror.mp3
modules/daggerheart-extra-content/assets/sfx-critical/adv-jumpscare.mp3
modules/daggerheart-extra-content/assets/sfx-critical/pc-brass-fanfare.mp3
modules/daggerheart-extra-content/assets/sfx-critical/pc-orchestral-win.mp3
modules/daggerheart-extra-content/assets/sfx-critical/pc-victory-rock-guitar-tapping.mp3
*/

const adversaryCritical = 20; // Change to 19 for Age of Umbra
const enablePCSound = true;
const PCSoundPath = 'modules/daggerheart-extra-content/assets/sfx-critical/pc-orchestral-win.mp3';
const PCVolume = 0.6;
const enableAdversarySound = true;
const AdversarySoundPath = 'modules/daggerheart-extra-content/assets/sfx-critical/adv-critical-tension-impact.mp3';
const AdversaryVolume = 0.6;

// =========================== 
const PCsoundConfig = {
  src: PCSoundPath,
  volume: PCVolume,
  autoplay: true,
  repeat: false
};

const AdversarysoundConfig = {
  src: AdversarySoundPath,
  volume: AdversaryVolume,
  autoplay: true,
  repeat: false
};

// critArgs: { roll, message }
const { roll } = critArgs;

// =========================== 
// Adversary
//if (roll.title==='D20 Roll') { 
if (roll.title===game.i18n.localize('DAGGERHEART.GENERAL.d20Roll') ) { 
  const die1 = roll.dice[0].results[0].result;
  let die2;
  let result = false;

  if ( roll.hasAdvantage || roll.hasDisadvantage ) {
    die2 = roll.dice[0].results[1].result;
    if ( roll.hasAdvantage && ( die1 >= adversaryCritical || die2 >= adversaryCritical ) ) {
      result = true;
    } else if ( roll.hasDisadvantage && ( die1 >= adversaryCritical && die2 >= adversaryCritical ) ) {
      result = true;  
    } else {
      result = false;
    }
  } 
  
  // Normal Roll
  if (die1 >= adversaryCritical) {
    result = true;
  } else {
    result = false;  
  }
  
  // Play the sound for critical
  if (result && enableAdversarySound) {
    AudioHelper.play(AdversarysoundConfig, true);
  }
  return result;
// =========================== 
// PC
//} else if (roll.title==="Duality Roll") { 
} else if (roll.title===game.i18n.localize('DAGGERHEART.GENERAL.dualityRoll')) {    

  const die1 = roll.dice[0].results[0].result;
  const die2 = roll.dice[1].results[0].result;

  // Duality Dice
  if (die1 === die2) {
    if (enablePCSound) {
      AudioHelper.play(PCsoundConfig, true);
    }
    return true;
  } else {
    return false;  
  }  
}